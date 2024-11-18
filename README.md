[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&env=GITHUB_WEBHOOK_SECRET,GITHUB_APP_ID,GITHUB_APP_PK_PEM&envDescription=API%20keys%20needed%20to%20connect%20to%20the%20GitHub%20Application.&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fon-demand-isr&demo-title=On-Demand%20ISR&demo-description=Demo%20of%20on-demand%20ISR%20in%20Next.js%2012.1%20using%20GitHub%20Issues.&demo-url=https%3A%2F%2Fon-demand-isr.vercel.app)

# On-Demand Incremental Static Regeneration
1. Get up and running quickly, and then get it to run quickly next.
1. Start with a static list of users, later replace with preferences, like the current logged in user.
1. Query git repository from users in list, allow user to select repository via link
1. For each repository fetch its details as a new query.
1. Write artifacts disk as zip file in cache directory

## TODOS
1. improve performance
1. Read the source code and artifacts from the git repository.
1. For each user return new query to get the git repository summary
1. add hyper links to user pages and git repository pages for all repose
1. add the default users to an multi select list of user.
1. select the max amount of repose default to 50.
1. Pre-compile data and write it on server in cache directory, save to git if you want.
1. Allow for evaluation and rendering of the data from the repository based on rules 
in the repository/artifact itself using caution and security minded evaluation.
1. Create a drop down that is pre-populated with git repository to select from.

1.1. create an ordering of the keys, a hierarchy
https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister

## Setup

For Vercel deployment, add the environmental variables to your server secret settings,
`https://vercel.com/<username>/<project>/settings/environment-variables`,
For local deploy add the variables to `.env.local`, do not check them in.

1. Create a new [GitHub App](https://github.com/settings/apps/new)
   1. Provide the URL of your deployed application for Homepage URL
   1. Ensure Web-hook "Active" is checked
   1. Add `<your-site>/api/webhook` as the Web-hook URL
   1. Create a Web-hook secret and add it to `.env.local` as `GITHUB_WEBHOOK_SECRET`
   1. Give "Read Only" access to Issues, git repository, 
   FIXME: add in the other permissions needed.
   1. Subscribe to "Issues" events
1. Add the App ID to `.env.local` as `GITHUB_APP_ID`
1. Generate a private key and add it to `.env.local` as `GITHUB_APP_PK_PEM`
quote and replace newlines like this :
```GITHUB_APP_PK_PEM="-----BEGIN RSA PRIVATE KEY-----\nABCEF==\n-----END RSA PRIVATE KEY-----"```
1. Install the newly created GitHub App for your repo
1. `https://github.com/settings/apps/<your-app-name>/installations`


## Running Locally

```bash
$ bun dev
```

## Steps to enhance this default app

```
  pnpm install -D tailwindcss postcss autoprefixer  --force
  pnpm dlx tailwindcss init -p
  ```
  
  Now add the components used by claude.ai its code.
  ```
  pnpm dlx shadcn@latest add card 
  pnpm dlx shadcn@latest add button
  pnpm dlx shadcn@latest add badge
```

# Issues

## Missing tar
`tar` itself was not working on vercel in various forms,
I finally got it working locally, but not on the server, this should be fine for the demonstration of utility but needs more work.

## Many projects and files
We have too many different projects and files to integrate and document.
It would be nice to be able to summarize this with the llms. 
We would like to have issues, pull requests and readmes for all project that can be summarized.
each one would be displayed as part of a presentation, so the issue browser becomes the presentation if we give them ordering, say in a naming convention to sort them by attribute like priority or urgency.

So I am rewriting and integrating all the code into this gui.


### Collecting cpu prof json files 
One part of the process is to download and prepare the inputs
The next part is to summarize and report. 
We separate those with the cache filesystem which is the interface.

#### Reporting 
Now we have the files collected and we are loading them in json

# Ideas

### Filter

Be able to filter the data read in by different tag
directory structure for example

## Extract summary from code
We want to summarize the projects from github

### project
List the projects

`curl http://localhost:3000 > page.html`

Give summary of project

Show related projects

### commit
Roll up commits to branch to project

## Extract terms and tags
vectorize and summarize tags by rolling up resource usage and profile data across the tokenization.
distribute the perf information to all tokens and vectors of the internal model, and then summarize it by
that internal model keys.

1. https post rest json action
1. api route handler reaction

## Go deeper into fact finding.

Given a trace of tests and performance data extracted and reports and slides, and reviewing them for improvements,
We should be able to create better reports or develop better tests that improve coverage, 
explain how some parameter changes or code changes affect the profiles, and construct proofs 
of connections between these. So we can show what metrics to measure, and how proposed changes will be measured.
We want to create a conti

## Make a better version of this page with AI
Have an AI Improve button on each page that would also include parts 
of the state that are not sensitive in a recording of a "Use Case"

###
What if the html of the page was succint and meant to be read by ai?

### Extract prompt from current page
Mindfullness,Introspection,Reflection,Reification,Export,Summary,Succinct,Argument,Knowledge
of current moment, breath, thought, and how it relates 
to the appearce of the visual output of computer code on a screen, 
in a layered network, a set of interacting systems with compute resources deployed and executing, with probes and debugger visiting and collecting and tweaking, a coder or programmer writing or insspecting compiler generated instructions, high level functions and module, deployment tools, inspecting and debugging instances of the page, all of this as 
input into a new model, a source of quality data that we can feed to ZKML AI. 
We can see this as convergence of models and tasks and how how the zkml is able to reason about itself and create proofs of itself reasoning about proving something. If we take the idea of monte carlo tree search using llms, and have them generate proofs about the current system as theories, then we can show how the llm can create a theory of self. It can show how it relates to the proof and all the steps that were followed in the model.

1. Include the current succinct goal and direction and context as a call stack
1.1. Source code, history of commit messages and changes
1.1. Relevant screenshot, html and data associated internaly, network post of data, the tcp session, tsl certificates
1. Creation of slides for presentations.
1.1. Link in zkp of slides contents into slide itself with all dependendencies.
1.1.1. Each slide like a polynomial or part of polynomial, associating new information into the system
1.1.1. The traces and summaries of perf information as informing a proof the execution of the code,
we can see it as an audit and trace, the zkp gives the summary and we can also reveal more or less information as needed.

