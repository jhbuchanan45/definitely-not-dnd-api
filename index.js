require('dotenv').config()

if (process.env.NODE_ENV === 'dev') {
    require("@babel/register")(
        {
            extensions: ['.js', '.ts']
        }
    );

    require('./src/server');
} else {
    require('./build/server');
}

