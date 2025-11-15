# Introduction

## What is `saflib-workflows`?

It is two things:

1. An npm package for having LLMs do routine coding work reliably
2. An experiment in automating routine work with LLMs generally.

This library came about while experimenting with and learning about how best to use LLMs in web development. It is the simplest way I can devise to have agents follow a plan reliably with automated supervision. It does this with developer-provided code templates, prompts, and validation checks.

The library provides the following:

- A way to define a routine software development task in TypeScript.
- Tools to test and run these workflows, including a CLI.
- Dedicated integrations with headless CLI agents (as of writing, only Cursor CLI).

This library is being written in conjunction with my web framework. So there are a variety of ever-evolving examples as I continue to iterate and experiment.

## Building Up Complexity

To generate large amounts of code reliably, it's important to start small, get the small steps to work well, and then build up from there. When writing workflows, they can be considered at three levels:

1. Individual steps
2. Routine workflows, which are a series of steps
3. Complex workflows, where one or more steps are other workflows

### Steps

A workflow is most of all a series of steps; a checklist or how-to guide to be followed.

The steps which this library comes with are:

1. Copy file(s)
2. Prompt agent to update file(s)
3. Arbitrary agent prompt
4. Shell Command
5. CWD (Change Working Directory)

I've included other core steps previously but they were basically specialized versions of the above. This list could _probably_ be simplified more but they're all important enough to be distinct.

Copy and update work together, and are often the first steps of any workflow. Files with the basic structure of the thing will be copied from a template, then the agent is prompted to update one or more of them with the implementation. Giving an agent a scaffold to build from greatly reduces variability and improves reliability, and sets the whole effort on the right foot.

Prompts are simply arbitrary commands to the agent. I often use these to do integration work, such as exporting the thing that was just implemented from the package.

Shell commands do double duty: they can be used to run scripts such as generating code from schemas, and they can run tests to make sure the agent has done the thing correctly. These are a great way to finish a workflow, to make sure the agent has actually built everything "to code".

CWD steps are mainly used in monolithic repos, and in complex workflows, where the context of one step is different than another. Think changing to the client directory after having worked in the server directory.

### Routine workflows

The most basic kind of workflow is something that is routine. For a web stack, routine (or simple) workflows might be:

- Add a query to the database
- Add a route to the http server
- Add a page to the web site

Most workflows I've written add some new unit, but that's mainly because what I've been using workflows for is building new products. There could also be workflows for removing or changing things, though this is an area I haven't explored as much since I haven't needed them yet.

Routine workflows benefit from regular investment. If they produce something suboptimal, the fix is often in the steps for one routine workflow or another. Combining or rearranging prompts, changing file templates, things like that. Code reviews don't result in feedback to an LLM which will be quickly lost, intermittently applied, or subsumed into a proprietary memory bank, but instead go into the routine in the code base that future agents will go through.

### Complex workflows

Workflows with other workflows as steps is how you generate large chunks of software. If your routine workflows are effective and put through the paces, then when you need to build a new feature, you write (or generate) a one-time workflow which is just a series of other workflows, and run that.

Complex workflows can also themselves take inputs to do a process many times, such as a migration. In which case you have one "entire migration" workflow be a series of calls to another "single migration" workflow, which itself calls various routine workflows.

### And Beyond?

Further levels of product generation are theoretically possible, but I have not gotten to them yet. Workflows could generate their own steps as they go, the same way milestones and epics are broken down into stories and tasks as you approach implementation, so that a large feature doesn't need to be planned out entirely in advance. And there could be workflows that go outside of the realm of engineering, deciding what features get built, experiments are run, and systems upgraded. There's no particular reason this tool could not also extend in these directions. It will just take time and research to see.

## Execution modes

There are various ways to execute a workflow which this tool supports.

### Agent-driven

This was the original way the tool was written: the agent calls the CLI tool and receives a prompt, does the thing it is told (hopefully) and then calls the workflow tool for the next prompt (hopefully). The agent repeats this until the workflow is complete (hopefully).

The trade-off is that while this mode works with any IDE or CLI coding agent tool, you're reliant on the agent being reliable, which it isn't. The workflow tool was written in large part because agents don't reliably follow instructions!

Running the workflow by calling the CLI for prompts is also a way to manually test do a workflow: instead of telling an agent to call the workflow tool you can just call it and follow the steps to check the experience, or to learn the process yourself.

### CLI-driven

This is the ideal way of running a workflow: have the CLI tool invoke the agent. This way you know that if the workflow tool completes successfully, then the workflow has been actually completed and all the checks have passed.

The downside is the workflow tool needs to have an integration written with whatever agentic tool is doing the work. At time of writing, only Cursor CLI is supported, however it wouldn't be hard to add more integrations.

### Debugging

The tool provides a couple other ways to run workflows which are useful for testing new or updated workflows:

1. Dry
2. Script

In a dry run, no commands are run, no files are copied, and no agents are prompted. It's a way to exercise everything that's "safe" in a workflow, for a quick test.

In script mode, files are copied and scripts are run, so there are file operations, but no agents are prompted. This is effectively an integration test where everything but the actions of the agent are tested. This is useful to make sure that, before having an agent do a workflow, you make sure all the fully-automatic work in a workflow... works.

## Other agentic workflows

I built this library because the kinds of workflow tools available in 2025 are costly in reliability, time, and risk which negate much of the potential value. Approaches fall into three groups:

1. Vibe coding
2. LLM micro-management
3. Black-box service

### Vibe coding

It is pretty amazing what people can build now without any coding knowledge, or without having to apply that knowledge. There is no doubt that out of the box, LLMs give people greater capabilities to build software.

However, at least the way agents behave now, building with this method quickly hits a wall. Agents write inconsistent and tightly coupled modules, with overly complicated functions and components, leading to a codebase that is brittle and cumbersome much sooner than a classically and professionally built stack does. The high of vibe coding and rapid development is followed by the hangover of massive, compounding tech debt.

LLMs are still a new technology, and there may yet be a fundamental shift in their capabilities through continued development. But I'm doubtful, and think what we have now is largely what we get for the time being.

### Micro-managing

A very different tack is to use LLMs heavily but with supervision. Code that is generated is reviewed, edited, trimmed, and fixed, either through more prompting or directly by the developer. This takes much more time than vibe coding, but it protects against cancerous code growths.

This approach can run the gamut from checking every line to being tactical about what generated code gets thorough review. Perhaps you spend more time on platforms, interfaces, and risky ares, and only give simple components or repetitive unit tests a passing glance. A balanced approach probably leads to the best productivity gains overall between the two extremes, but it's not all _that_ much faster than simply building without LLMs.

### Black box service

Perhaps the most ambitious attempt to change the nature of software development are products and services that eschew code as the source of truth at all; instead product specs and kanban boards are the "source". Instead of building and maintaining a codebase by hand, documentation is written and updated and code is generated from that corpus, like some sort of higher-order compiler. These are the most extreme; there are of course services which help you start the product with a description and some iteration, then allow you to "eject" the code that's built which can be expanded upon normally.

It may be that one or more of these services can produce great things, but finding out directly is risky and time consuming. One could evaluate their potential by building many products with many of them. But this is costly and if it turns out they don't work, it may not be possible to determine why since it's likely the mechanisms and strategies are proprietary and hidden. If someone I trust comes to me and says they've found a product that, in their experience, lives up to the hype and can build highly complex, performant, secure, and reliable products, I'll take a closer look but otherwise I don't plan on investing much time in these.

---

In an indirect way, this library is my attempt to see how viable these approaches really are. By building my own framework for generating routine code reliably, I can get a better sense of how high this house of cards really can go.
