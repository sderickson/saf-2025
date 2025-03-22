# AI Learnings

Scratch document for my thoughts on AI and how it relates to web development.

## AI Tools Themselves

I'm keeping it fairly simple. I'm mainly using Claude Sonnet, either directly through their website or with the Cursor code editor. When I feel that I've exhausted how much I can do with this combo, I'll explore other tools. I did do a brief foray into Cursor + GPT4o, but I very quickly reverted because Claude is so much more proactive.

More to add here later, then.

## Using AI in Software Development...

### ...For Code

The classic use case for AI - the auto-complete. This certainly helps move things along; I will often have an intention to add some code, such as by adding a parameter to a function or creating a variable, and it will provide the functionality. Or I'll start to make a series of repetitive changes, and it will handle that, where before I'd have used some sort of multi-cursor feature. Sometimes it will not suggest the right thing, or want to add things I don't want added, but it's not too hard to ignore those suggestions.

Solid win. Just make sure you read and understand and test everything that's written.

Well, I'm not even sure it's absolutely necessary to understand everything that's written... For example with the generate-docker.ts file, I did not go through and make sure I understood absolutely everything. But so far, it's generating the results I want. Docker is behaving as I'd like. The script and behavior is not so complex that I can't go in and make changes when needed. And the stakes are low; I pay more attention to the services/auth code for example.

For scripts then, the rules are more lax. I want backend services and libraries to stand the test of time, but development tools just need to get the job done. Use best judgement for how much judgement a piece of code requires.

### ...With Unfamiliar Tools (to the Human, and maybe also to the Agent)

This has been a bit less helpful, and seems like one of the main ways AI can lead a codebase to ruin. Some instances:

- I wasn't sure how to set up an nginx conf, and it generated one that I had no confidence in its performance, security, or ability to do what I wanted.
- I hadn't used vuetify before, and I asked it to create a landing page. It made an overly complicated page using a vuetify-grid-row-column layout with a single cell, and nothing was centered. Well, I can empathize there.
- I hadn't gotten very much practice with more advanced TypeScript features like generics, and I tried to set up a way to lookup the request and response types for express routes. It made something overly complicated and verbose using a function which should never be called and ReturnType.

In all these cases, I stopped what I was doing and went elsewhere. I found Mozilla's recommended nginx config tool, and read through Vuetify and TypeScript's documentation and came up with better solutions.

I'm kind of curious what a better approach would be here. If the AI were a junior dev, I'd press them to critically assess what they produced, spend more time learning the tools they're trying to weild, you know, coach them. But there's no point in doing that with Claude.

Well, maybe there is. I'm experimenting with writing documentation, and using that to feed into AI. So for example I might have a "using-vuetify.md" file which includes things like "do this not that" and everytime I want the agent to build something with vuetify I'll say "make sure to build based on using-vuetify.md guidelines". So I can gradually train the agent in this way.

> Aside: interesting... so I used "instructions.md" as context for Claude to make a new library and it still gave files the ".js" extension for imports. I pointed out the instructions said _right there_ to use ".ts". Then Claude was like "well actually..." because of how Node works. Then I was like "well actually..." and pointed out we're using experimental type stripping with Node, so Node works differently and expects ".ts" extensions. It finally agreed with me and put that context into the instructions. So, just as in real-life coaching, maybe it sticks better if you help them understand the why? Will see next time Claude generates something.

This approach still requires you to build your own deep understanding of tools like vuetify, and it's interesting to think about how to sidestep that. Can I write a website with vuetify without even having skimmed the docs? It's hard to imagine, but if one can reduce the depth of knowledge of all the tools involved in building a website that is necessary to be effective, by using an AI for deep knowledge, then you can go a fair bit faster I think. Then the skill/knowledge you need is reduced to:

- Can you tell what the code is doing? Either through the names/docs of the library itself, or with added comments.
- Can you identify when something feels hacky and/or overly complicated? Improper use of a tool.

In this way, perhaps you can assess the output of the AI without ever having deeply learned the tool they're using.

### ...For Architecture, Best Practices, Tool Choices

For deciding what goes into my app base, mostly the agent has been useful to ask for suggestions or thoughts on a way of doing things. It gives good pro/cons, and when I ask for a tool with certain capabilities, it will suggest tools that fit the criteria. Most of the time in following up its leads, I'm satisfied. It's just important to do so, exercise your own critical thinking. It helps here to be a "satisficer" instead of an "optimizer". As soon as Claude recommended Caddy, I looked at and thought "that's satisfactory". There may be better nginx-like software out there, but I don't need _the_ perfect tool, I need _a_ tool that meets my requirements.

It's also useful for identifying things you hadn't thought about. I fed Claude my decisions.md dock and it suggested half a dozen other dimensions that I should talk about as well. This is probably just generally a useful thing for such tools: feed it a first draft and ask if there are any key points or questions to address. Brainstorming just generally seems like a good use of AI.

It's also interesting, sometimes the auto complete or the code it generates is a "tell" for what would be a better way of doing things. For example, I'd ask the AI to update the package.json file, and several times it would do what I asked _and also_ add a scope to my monorepo packages. I hadn't bothered to add those but it's the industry standard. It's sort of a passive-aggressive way of showing when what you're doing is non-standard or weird, but it's helpful to keep an eye out for. And anyway I got tired of it trying to put those in and relented, and just added them so I'd stop fighting with it. This also happened with whether to throw errors for db library getById functions.

### ...For Consistency, Refactoring, and Documentation

I'm trying out incorporating **templates** and **documentation** for propagating best practices and consistency across the codebase. The process goes like this:

- If I'm doing a process that I want to be repeatable, I walk the AI through it, usually having to adjust what they do.
- After I've worked with the AI agent to fix everything, I ask the AI to document the process we just did.
- Next time I want them to do the same process, I just ask them to follow the documentation they wrote.

If the process involves some base setup, like adding a new package to the repo, I'll add a **template** folder to the repo, ask the AI to fill it based on other instances I've already created and document it fully.

One way to use this **template**, is if I want to generally change the structure of that thing (like a service, or a library), I adjust the template and then ask the AI to update all the instances of that thing with the changes that were made. I just tried this, and I did have to encourage the AI to do all of it, but if there were dozens of instances... I think the approach here might be one-off scripts. I haven't tried this yet but I will next time.

## Second Order Effects Coding with AI Has On...

So, the above is direct impact on the act of coding. What about things that are indirectly affected?

## ... Quality

I think AI is actually going to improve the quality of code and software generally, but not so much directly: instead it's going to make having good quality code and documentation and open APIs _more valuable to the business_. In the following ways:

- If code is well structured, the agent can mimick it. Good code begets good code, bad begets bad.
- If behavior is well tested, you can have some assurance the agent isn't breaking something unnecessarily, and the agent can more readily fix issues by running tests and fixing breakages.
- If processes are well documented, the agent can follow those instructions with less hand-holding by developers.
- If modules are well organized and scoped, the agent can make changes more easily because with proper separation of concerns, it requires less context to do the right thing.
- If services are open, the agent can read the documentation and build a custom connector for that service and guide the user on how to set it up, encouraging greater use and investment.
- If approaches become industry standards and are widely available and used, then AI models can be trained and will generally output better results.

Quality code building should have a direct impact on the business' ability to build and scale and evolve quickly.

## ... Models Being Built

Given that models are based on what you put in, presumably we could get more purpose-built models, for example a model which specializes in the tools that this repository uses, would probably be faster, cheaper, and more accurate than the general-purpose Claude Sonnet. Ideally, training would need to be cheaper for a proliferation, though, or even custom built ones for a repository like this one?

## ... Public Policy

With the need for more data, there's a great deal of it, but it's locked away behind proprietary walls. Could there be a corporate tax, where each corporation must contribute 10% of its code, its writings, its processes, its designs? Will AI lead to a proliferation of open-sourced value?
