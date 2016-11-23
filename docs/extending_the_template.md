# How to use this template to make a new HTML Widget

New widget time, excellent. It would be great if we had a [yeoman](http://yeoman.io/) style project template, but in the absense of that, follow the steps in the sections below:

## Initial Git Repo Setup

1. Navigate to your projects directory
1. Lets assume the new widget is called `rhtmlNew`. In reality you should pick a more relevant name.
1. Open (OSX) terminal / (Windows) git shell
1. Create a clone of the rhtmlTemplate project by typing `git clone git@github.com:NumbersInternational/rhtmlTemplate.git`
1. The command above creates a directory called rhtmlTemplate. Rename the directory to rhtmlNew
1. Change directory into the new directory. type `cd rhtmlNew` ENTER
1. modify the `/.git/config` file using the editor and change the upsream origin to `rhtmlNew`. The `[remote "origin"]` should look like this:

```
    [remote "origin"]
            url = git@github.com:NumbersInternational/rhtmlNew.git
            fetch = +refs/heads/*:refs/remotes/origin/*
```

1. Go to github and create a new repository called `rhtmlNew` in the Numbers organization
1. Push your new code to rhtmlNew master : `git push origin master`

## Project Customization

Remember you still need to follow the [Local Installation to Develop/Contribute](../README.md) to get your new widget working locally (basically just run `npm install`).
To make sure you are starting from a good base go make sure rhtmlTemplate is working (i.e., follow the [Local Installation to Develop/Contribute](../README.md) instructions above) when you run `gulp serve` before proceeding.

Next delete the auto generated directories, so that no old files get carried over. Run `gulp clean` to delete all the auto generated content, i.e., [`browser`, `inst`, `man`, `R`, `examples`].

You will need to modify some files before you get to the coding part. Everything that needs to be changed should have a comment starting with `TEMPLATE`. These locations are listed below:

* **./build/config/widget.config.json** - update the widget name and the R function name. This config is used by the following files, therefore you shouldn't have to update any of these files:
    * ./gulpfile.js
    * ./build/scripts/convertContentToExampleInR.coffee
    * ./build/scripts/testVisual.js
* **./DESCRIPTION** - update the widget name
* **./theSrc/internal_www/js/loadDependenciesAndStartRender.coffee** - keep the list of widget js and external dependencies up to date
* **./build/config/externalLibs.json** - keep the list of dependencies up to date
* **./theSrc/R/htmlwidget.R** - update the widget name and keep the R docs up to date
* **./theSrc/R/htmlwidget.yaml** - keep the list of dependencies up to date
* **./theSrc/scripts/rhtmlTemplate.coffee** - rename file to match your widget name, update the widget name in the file. Note the file name (without the .coffee extension) must match the widget name specified in the createWidget call in `htmlwidget.R`
* **./theSrc/scripts/Template.coffee** - this is the top level class that encapsulates the business logic of the widget. You will need to rename the file to something the makes sense for your widget (e.g., Pictograph), and update most of the file. There are instructions in the file for what needs to stay the same and what should be changed. It is worth reading [how the code works](./how_the_code_works.md) before starting.
* **./karma.conf.js** - this is the test config. There is a list of source files that will need to be updated with your widget name.
* **./test/templateSpec.coffee** - this tests Template.coffee. You will need to rename it and write some tests.

That should be it. If you follow the instructions above you shouldn't have to change anything else, but you are free to structure things how you like, it will just require some modifications to `gulpfile.js`.

Final note you should delete the template docs out of the `docs/` folder and you are responsible for keeping the `README.md` of your new project up to date!
Happy coding :)

## Adding a new JS dependency
Currently the rhtmlTemplate uses `lodash`, `jquery`, and `d3` as JS dependencies. These dependencies are referenced in `package.json`, `htmlwidget.yaml`, and `build/config/externalLibs.json`, and `theSrc/internal_www/js/loadDependenciesAndStartRender.js`. If you need to add package X to your new widget, here are the steps.

1. Install the module from npm and save it to the list of dependencies via `npm install --save X`. This will install the module locally in node_modules, and it will add it to the list of project dependencies in `package.json`
1. Inspect the node_modules/X directory to determine the version and the main file.
    1. For example jquery is version 2.2.2, which is listed in node_modules/jquery/package.json, and the main file is in node_modules/jquery/dist/jquery.min.js
1. Add the dependency to extLibs array in the `./build/config/externalLibs.json` file. Note the order is important so if your file relies on Y then put it after Y.
1. Add the dependency to `htmlwidget.yaml`.
1. Add the dependency to `theSrc/internal_www/js/loadDependenciesAndStartRender.js`. If this file cannot load until something else is loaded, follow the pattern in the file to ensure correct loading order.


