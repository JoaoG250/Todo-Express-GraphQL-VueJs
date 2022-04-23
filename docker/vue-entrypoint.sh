#!/bin/sh -e

work_dir="/home/node/todoapp/vue"
h_spacer="========="
e_spacer=":::::::::"
red='\033[0;31m'
white='\033[0;37m'
reset='\033[0m'

yarn_install() {
    cd ${work_dir}

    echo "\n${white}${h_spacer} Installing yarn dependencies ${h_spacer}${reset}\n"
    yarn install
    if [ $? -ne 0 ]; then
        echo "\n${red}${e_spacer} Error installing yarn dependencies ${e_spacer}${reset}\n"
        exit 1
    fi
}

case $1 in

setup)
    yarn_install
    ;;

development)
    exec yarn dev
    ;;

*)
    exec "$@"
    ;;

esac

exit 0
