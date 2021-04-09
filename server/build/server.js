"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _checkJWT = _interopRequireDefault(require("./middlewares/checkJWT"));

var _user = _interopRequireDefault(require("./routes/user"));

var _token = _interopRequireDefault(require("./routes/token"));

var _map = _interopRequireDefault(require("./routes/map"));

var _campaign = _interopRequireDefault(require("./routes/campaign"));

var _player = _interopRequireDefault(require("./routes/player"));

var _pClass = _interopRequireDefault(require("./routes/pClass"));

var _item = _interopRequireDefault(require("./routes/item"));

const app = (0, _express.default)();
const PORT = process.env.PORT || 3000;

_mongoose.default.connect(`${process.env.DB_HOST}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully connected to database!");
}).catch(err => {
  console.log("Failed to connect to database.");
  console.log(err);
  process.exit();
});

app.use((0, _cors.default)());
app.use(_express.default.json({
  limit: '5mb'
}));
app.use('/api/user', _checkJWT.default, _user.default);
app.use('/api/token', _checkJWT.default, _token.default);
app.use('/api/map', _checkJWT.default, _map.default);
app.use('/api/campaign', _checkJWT.default, _campaign.default);
app.use('/api/player', _checkJWT.default, _player.default);
app.use('/api/class', _checkJWT.default, _pClass.default);
app.use('/api/item', _checkJWT.default, _item.default);
app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});