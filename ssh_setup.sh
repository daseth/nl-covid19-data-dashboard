#!/bin/sh

ssh-keygen -A

#prepare run dir
if [ ! -d "/var/run/sshd" ]; then
    mkdir -p /var/run/sshd
fi

if [ ! -d "/run/openrc" ]; then
    mkdir -p /run/openrc
fi
