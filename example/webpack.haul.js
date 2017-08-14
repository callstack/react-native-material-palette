module.exports = ({ platform }) => ({
  entry: `./index.${platform}.js`,
  devtool: 'eval-source-map',
});
