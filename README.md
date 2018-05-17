Stripe-Salesforce
=================

This repo integrates [Stripe Checkout](https://stripe.com/docs/checkout) and [Salesforce](http://www.salesforce.com/) into our [donations app](http://support.texastribune.org/).

Getting Started
---------------

The recommended method for running this repo locally is to use [Docker](https://www.docker.com/). If you don't already have Docker set up, you'll want to [install Docker for Mac](https://docs.docker.com/engine/installation/mac/) to get a Docker environment set up on your computer.

You'll also need to have an `env` file set up with the environment variables for Stripe and Salesforce so that Docker can find them.

Running the Project
-------------------

Run `make backing`. This will start RabbitMQ and Redis.
Run `make interactive`. This will drop you into the Flask app.
Run `yarn run dev`. You should then be able to interact with the app at `local.texastribune.org:80`
```
# flower -A app.celery --port=5555 --address=0.0.0.0    # monitoring
C_FORCE_ROOT=True celery -A app.celery worker --loglevel=INFO &
celery beat --app app.celery &
# gunicorn app:app --log-file=- --bind=0.0.0.0:5000 --access-logfile=-
```

Blastform: http://local.texastribune.org/blastform

Front-end commands:
+ `yarn run dev`: Start Flask development server and watch for JS and CSS changes
+ `yarn run js:dev`: Just watch for JS and CSS changes

Front-end notes:
+ On `yarn run dev`, all files are built to `/static/js/build`, which **is** ignored from version control. That way you can make as many changes as you want when developing, Webpack will recompile the files, and they'll never show up in VC.
+ On deploy, all files are built to `/static/js/prod/`. This is **not** ignored from VC because Heroku cannot create directories and thus needs it to exist in the repo. That's why it contains a `.gitkeep` file.
+ On deploy, the production JS has to be built via the `postinstall` script. This means that, if you run `yarn` or `yarn add <package>` locally inside Docker, you'll get some compiled files in `/static/js/prod/` that show up in version control. **Delete them!**

**Important note**: To build our JS on deployment, Heroku needs to run a `postinstall` script in `package.json`. This also means every time you run `yarn` or `yarn add <package>`, it's going to trigger that build and generate a bunch of files in `static/js/prod/`. Don't commit these!

Running tests
-------------

To run the project tests, run
`make interactive`
`py.test tests.py`


Deploy
-------------------

If you're not invited to the Trib's Heroku group, get someone to invite you. Log in to Heroku on your console. Follow [Heroku instructions](https://devcenter.heroku.com/articles/git) for deploying. Specifically, you'll run the command `heroku git:remote -a stripe-prod` to add heroku to the project.

Replace the `[remote "heroku"] stanza in your .git/config file with the following to tell Heroku/Git where to push your branch, production or test:

```
[remote "production"]
  url = https://git.heroku.com/stripe-prod.git
  fetch = +refs/heads/*:refs/remotes/production/*
[remote "test"]
  url = https://git.heroku.com/stripe-testing.git
  fetch = +refs/heads/*:refs/remotes/heroku/*
```

Then deploy to test with the command `git push test master` or production with `git push production master`.

If you need to deploy a branch other than master to the test server, use the command `git push <server> <branch>:master`. For example `git push test your-branch-name:master`.

Test URL: http://stripe-testing.texastribune.org/
