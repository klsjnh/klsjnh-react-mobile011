#!/bin/bash

vf=./.vf

if [ `git status | grep "nothing to commit" | wc -l` -eq 1 ]; then
	  echo "nothing to change ..."
	    exit
fi

v=`expr $(cat $vf) + 1`
echo $v > $vf
git add .
git commit -m "ver 0.0.$v ..."
git push
