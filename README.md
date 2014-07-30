Georgia Tech Health Dashboard
============

Welcome to the project page for the Georgia Tech Health Dashboard!

You can download a release copy of the project or its source code [here]. 

This project is provided as-is. If you find any bugs, feel free to submit a **properly-tagged** issue in the GitHub tracker. If you want the bug to be fixed quickly, fork the repo, find where it is, and put the info into the issue, or just submit a pull request, and I'll merge it in. 

***Note:***
*Using this project requires basic familiarity with the Linux command line. You should be able to comfortable navigate the directory structure and run executables with elevated privileges as necessary. You should also be able to close processes (I recommend using [htop]).*

Getting Started
--------------

Download and extract the file. Go to the **gt-dashboard** directory. 

The application consists of a several parts:

 - **A portable nginx server** (version 1.6.3)
 - **A portable mongo database** (version 2.6.3)
 - **A Flask server** (Python,  0.10.1)

All of these are started and stopped by the **"run"** file in the root directory. 

To start the various applications, type:

```zsh
user :: ~/gt-dashboard <master)> >> ./run start
```

To stop everything (additional checking may be required), type:

```zsh
user :: ~/gt-dashboard <master)> >> ./run stop
```
Documentation
------------

The documentation for the project can be found [at the wiki]. 

If you have any questions, feel free to submit an issue **tagged with "question"** (or I will close it), or email me at [ritzymail@gmail.com]. 

[at the wiki]:https://github.com/ritwikd/gt-dashboard/wiki
[ritzymail@gmail.com]:mailto:ritzymail@gmail.com
[here]:https://github.com/ritwikd/gt-dashboard/releases/latest
[htop]:http://hisham.hm/htop/
