export default function addNumberCommas(x) {
  console.log('foo');
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
