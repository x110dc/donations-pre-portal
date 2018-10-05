import logging
from config import STRIPE_KEYS

import stripe

stripe.api_key = STRIPE_KEYS["secret_key"]

TWOPLACES = Decimal(10) ** -2  # same as Decimal('0.01')


def amount_to_charge(opportunity):
    """
    Determine the amount to charge. This depends on whether the payer agreed
    to pay fees or not. If they did then we add that to the amount charged.
    Stripe charges 2.2% + $0.30.

    https://support.stripe.com/questions/can-i-charge-my-stripe-fees-to-my-customers
    """
    amount = float(opportunity.amount)
    if opportunity.pay_fees:
        total = (amount + .30) / (1 - 0.022)
    else:
        total = amount
    return quantize(total)


def quantize(amount):
    return Decimal(amount).quantize(TWOPLACES)


def charge(opportunity):

    amount = amount_to_charge(opportunity)
    logging.info(
        f"---- Charging ${amount} to {opportunity.stripe_customer} ({opportunity.name})"
    )

    try:
        charge = stripe.Charge.create(
            customer=opportunity.stripe_customer,
            amount=int(amount * 100),
            currency="usd",
            description=opportunity.description,
            metadata={
                "opportunity_id": opportunity.id,
                "account_id": opportunity.account_id,
            },
        )
    except stripe.error.CardError as e:
        # look for decline code:
        error = e.json_body["error"]
        logging.info(f"The card has been declined:")
        logging.info(f"Message: {error.get('message', '')}")
        logging.info(f"Decline code: {error.get('decline_code', '')}")
        opportunity.closed_lost_reason = error.get("message", "unknown failure")
        opportunity.save()
        return
    except stripe.error.InvalidRequestError as e:
        logging.warning(f"Problem: {e}")
        return
    except Exception as e:
        logging.warning(f"Problem: {e}")
        return
    if charge.status != "succeeded":
        logging.warning("Charge failed. Check Stripe logs.")
        return
    opportunity.stripe_transaction_id = charge.id
    opportunity.stripe_card = charge.source.id
    opportunity.stage_name = "Closed Won"
    opportunity.save()
