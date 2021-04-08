#! /bin/bash

if  ! command -v yarn ]
  then
    echo 'installing yarn'
    curl -o- -L https://yarnpkg.com/install.sh | bash
  else
    echo 'yarn installed'
fi

# install dependancies
yarn install

# build project
yarn run build