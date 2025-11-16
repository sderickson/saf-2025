# Scope and Design

## How much should the workflow do?

Each routine (simple) workflow should be fairly focused. Workflows do not "branch"; at most you'll be able to skip a step under conditions you specify. So if a workflow would have a great deal of conditional logic, it should be broken down into separate workflows which can be composed into a complex workflow per some execution plan.

How generic a workflow should be depends on what is consistent across your project. For a monolithic codebase broken down into multiple packages, if each package has the same `typecheck` script and `test` script, and all tests live in a consistent location relative to a given file, then you could have a test which is simply "update this file" and set it up with steps to run typechecking and unit tests before completion. But to start, it's best to stick with workflows for adding new things to the codebase, to build out quickly and consistently.

Here is an example list of workflows which are included in [SAF](https://docs.saf-demo.online/):

```
commander/add-cli     
commander/add-command 
cron/add-job          
cron/init             
drizzle/add-query     
drizzle/init          
drizzle/update-schema 
email/add-template    
env/add-var           
express/add-handler   
express/init          
grpc/add-handler      
grpc/add-proto        
grpc/add-rpc          
grpc/init-client      
grpc/init-proto       
grpc/init-server      
identity/init         
monorepo/add-export   
monorepo/add-package  
openapi/add-event     
openapi/add-route     
openapi/add-schema    
openapi/init          
processes/spec-project
sdk/add-component     
sdk/add-query         
sdk/init              
service/init          
vue/add-page          
vue/add-spa           
workflows/add-workflow
```

## Workflow arguments

Workflows take any string argument, but it's good to adopt some conventions. When creating workflows for SAF, it turns out the vast majority of workflows can get away with just either or both of the following:

* `name` - kebab-case name of the thing, such as `user` for a database table, `@saflib/new-lib` for a new npm package, or `welcome-page` for a web component.
* `path` - relative path for the main file being added, such as `./src/components/welcome-page.ts` for a web component.

A package which uses all three combinations is [@saflib/openapi](https://docs.saf-demo.online/openapi/docs/workflows/index.html).

* `openapi/init` takes both the `name` of the package and the `path` to instantiate the library.
* `openapi/add-schema` takes just a `name`, since all schemas go in the same directory.
* `openapi/add-route` takes a `path`, since routes are grouped by resource, for example `./routes/users/list.yaml`.

If your code and names follow conventional patterns, you can also infer values. See [template docs](./templates.md) for more details.