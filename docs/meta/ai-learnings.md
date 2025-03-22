# AI Learnings

Scratch document for my thoughts on AI and how it relates to web development.

## AI Tools Themselves

### Editors and Alike

I'm keeping it fairly simple. I'm mainly using the latest version of Claude, either directly through their website or with the Cursor code editor. When I feel that I've exhausted how much I can do with this combo, I'll explore other tools.

I did do a brief foray into Cursor + GPT4o, but I very quickly reverted because Claude is so much more proactive. Though, recently they introduced an auto feature that chooses the agent for you. It's been good, it has been noticeably faster, and it's still fairly proactive. So even if sometimes behind the scenes it uses Claude and sometimes it doesn't, my experience hasn't dramatically changed.

I'm interested in trying Windsurf, that's been mentioned.

There are also a bunch of features I haven't fully explored. One I'm particularly curious with is Cursor rules. I'd rather not get locked into Cursor, but I feel like something like this has gotta become a standard. One thing I've been doing with my new framework has been pretty consistently writing documentation for the common tasks. It's been tough getting Cursor to consistently review those docs, though. I have the agent create a checklist for each feature now, and it's based off a template. Pretty frequently, though, the agent doesn't include the checks to review the docs. And oftentimes the agent doesn't seem to actually check the files.

This is where rules might come in.

I tried setting up a rule based on file extension, but it doesn't trigger at the most important time: when the file is created. I [filed a bug](https://forum.cursor.com/t/rule-doesnt-auto-apply-on-new-files/67141).

So I'm trying out now adding a universal rule which links to all the documentation. I'm still having trouble getting the agent to consistently review the docs on its own, though. It really likes to dive into things head first. I might just have to prod it to look at the docs before each prompt.

### Services

I've been using CodeRabbit to review my code. It's been fine. It's free for me, and it gives some suggestions. The ones that are actionable and not nits do tend to be things that I should do, in that PR or in a future one. The summaries I don't think are much more useful than what I write, but that's probably because my PRs are so sprawling right now it's hard to figure out what the main point is. However, I wouldn't consider CodeRabbit to be a replacement of writing your own PR summaries, or of PR reviews. They're a good first pass.

I should try Ellipsis, I've heard that mentioned.

### Custom Tools

One of the things that has been talked about is "memory". This is useful for longer projects where you might need to switch between different agents, or just work with a new iteration of the same agent, and you want them to pick up where the last one left off.

I'm trying a sort of thing like that in having a checklist for each project. Actually, I start each project with a spec, then ask the agent to create a checklist based on the spec. The spec ends up not being used I think? At least, it doesn't seem like the agent reviews it after creating it. But it's neat to have nonetheless, for the record.

The checklist, the agent also has a tendency to forget about, but I keep reminding the agent to keep it up-to-date.

Maybe I should try prompting the agent to be a stickler for lists...

One thing I'm interested in trying there is giving the agent more tools to use. A todolist might be a good tool for it to use. Then I can enforce that it not only create a plan but also stick to it, or mark it won't complete.

## Using AI in Software Development...

### ...For Code

The classic use case for AI - the auto-complete. This certainly helps move things along; I will often have an intention to add some code, such as by adding a parameter to a function or creating a variable, and it will provide the functionality. Or I'll start to make a series of repetitive changes, and it will handle that, where before I'd have used some sort of multi-cursor feature. Sometimes it will not suggest the right thing, or want to add things I don't want added, but it's not too hard to ignore those suggestions.

Solid win. Just make sure you read and understand and test everything that's written.

Well, I'm not even sure it's absolutely necessary to understand everything that's written...

Let's talk about vibe coding.

I sort of tried this before it was termed when I generated the generate-docker.ts file; I did not go through and make sure I understood absolutely everything. I scanned it and was like, eh... could be better, but hey it's doing what I want. Then I came back later and tried to extend it and the agent couldn't hack it, and neither could I. I ended up rewriting most of it, which was a drag.

So, vibe coding is fine if you build something you never want to touch again.

For some scripts then, especially one-off scripts, the rules are more lax. I want backend services and libraries to stand the test of time, but that's not the case for everything. Use best judgement for how much judgement a piece of code requires.

### ...With Unfamiliar Tools (to the Human, and maybe also to the Agent)

This has been a bit less helpful, and seems like one of the main ways AI can lead a codebase to ruin. Some instances:

- I wasn't sure how to set up an nginx conf, and it generated one that I had no confidence in its performance, security, or ability to do what I wanted.
- I hadn't used vuetify before, and I asked it to create a landing page. It made an overly complicated page using a vuetify-grid-row-column layout with a single cell, and nothing was centered. Well, I can empathize there.
- I hadn't gotten very much practice with more advanced TypeScript features like generics, and I tried to set up a way to lookup the request and response types for express routes. It made something overly complicated and verbose using a function which should never be called and ReturnType.
- I tried to have Cursor agent take the lead and create an RPC service. I questioned a lot of what was written, and when we finally finished building everything... it didn't work. And the agent spent time just adding features which were premature when the base functionality wasn't there.

In all these cases, I stopped what I was doing and went elsewhere. I found Mozilla's recommended nginx config tool, and read through Vuetify and TypeScript's documentation and came up with better solutions. At the time of writing I'm looking at starting the RPC service from scratch.

I'm kind of curious what a better approach would be here. If the AI were a junior dev, I'd press them to critically assess what they produced, spend more time learning the tools they're trying to weild, you know, coach them. But there's no point in doing that with Claude.

Well, maybe there is. I'm experimenting with writing documentation, and using that to feed into AI. So for example I might have a "using-vuetify.md" file which includes things like "do this not that" and everytime I want the agent to build something with vuetify I'll say "make sure to build based on using-vuetify.md guidelines". So I can gradually train the agent in this way.

> Aside: interesting... so I used "instructions.md" as context for Claude to make a new library and it still gave files the ".js" extension for imports. I pointed out the instructions said _right there_ to use ".ts". Then Claude was like "well actually..." because of how Node works. Then I was like "well actually..." and pointed out we're using experimental type stripping with Node, so Node works differently and expects ".ts" extensions. It finally agreed with me and put that context into the instructions. So, just as in real-life coaching, maybe it sticks better if you help them understand the why? Will see next time Claude generates something.

This approach still requires you to build your own deep understanding of tools like vuetify, and it's interesting to think about how to sidestep that. Can I write a website with vuetify without even having skimmed the docs? It's hard to imagine, but if one can reduce the depth of knowledge of all the tools involved in building a website that is necessary to be effective, by using an AI for deep knowledge, then you can go a fair bit faster I think. Then the skill/knowledge you need is reduced to:

- Can you tell what the code is doing? Either through the names/docs of the library itself, or with added comments.
- Can you identify when something feels hacky and/or overly complicated? Improper use of a tool.

In this way, perhaps you can assess the output of the AI without ever having deeply learned the tool they're using.

**Update:** So in trying this out again with gRPC, and TypeScript, two technologies I am not as familiar with as I'd like to be, I _do_ think you go a lot slower if you don't understand the thing you're trying to get the agent to build. Maybe agents will become better with time, better enough that they'll actually build something right with just acceptance criteria but... they ain't there now, and I'm not sure when/if they'll get that far. I think that'll be my next "aha" moment if I get an agent that just does it _right_, or a lot more right than it does now.

The way I'd like it to go is that I can review the code that is written, be able to ask questions of it, and have the answers mostly be clear explanations to why the way they did it is the, or a, right way to do it. Instead, much of it is "oh you know, we don't need that" or "oh this is actually written wrong" which is the answer to a good number of my questions about generated code.

I think it's sort of like self driving cars. I need to drive a certain number of miles paying attention to what it does, making sure it does the right thing, before I become comfortable enough to let my attention wander more. In the same way, I need to see the AI build something right, and thoughtfully, and minimally, before I let it build something with me paying minimal attention. And so far I haven't made a single feature that hasn't needed my guidance or intervention.

I'm sort of hoping that if I can figure out the right prompt/documentation combo, I'll get to the point where it's reliable enough that I can pay less attention for fairly rote and repeated work, but I'm unsure if that will be enough.

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

**Update**: I haven't been using templates for a while. I think it's better to just have good documentation with examples, and good example services to point to. That should be enough.

Better yet, I notice that the agent tends to respond to and handle linter errors pretty consistently and quickly. At some point I'd like to take some of the guidance I put into documentation and instead create linters so that the agent gets immediate feedback when it goes a weird way.

### ... For Business Processes

So here's an idea: you can use LLMs to monitor and manage site complexity.

There's a tendency when working on growth that the longer and more complex the funnel, the higher the drop-off. There are just more opportunities for the user to leave before finishing the thing. But there's also a tendency at businesses to add more _stuff_ to a product, which tends to make doing the core feature harder, because there's more to wade through, more text to read, more buttons to click, more stuff to grok. Like, right now I tend to prefer using DigitalOcean because it's more focused and simpler for what I want, to rent a server, whereas products like AWS through just about everything at you.

Site complexity can be measured in a few different ways. Reliability and performance metrics are a couple groups of metrics. Conversion rates is another. But LLM evals give us a new one: token count.

With an eval, you tend to measure the ability and consistency of an agent to do a thing. It's an automated test for an agent. But it not only measures the agent's ability, but also its cost. And cost goes up the more the agent has to read, understand, and interact with. So it's a fairly comprehensive measure of "complexity". It's sort of like an automated UX test, where instead of observing the tester's mounting frustration, you measure the mounting agent token cost.

One thing you could do, is set up an eval telling an agent to do a core JTBD of your product, then monitor how many tokens it tends to cost to do that, or even how consistently it finishes the job. This could be a leading indicator of business metrics, and a way to measure and guard against product bloat weighing down the core product.

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

## ... Interviewing

While I was at Dropbox, I was the Engineering Interview Question lead. I focused on traditional roles like frontend, backend, infra, iOS, and Android engineers, but we also had a bank of machine learning questions. I wonder now how AI tools might affect how we interview engineers.

Well, the existing questions are still relevant. It's important for an engineer to understand code, software design, and architecture, because if they can't write, organize, and design these things well, they can't make sure generated code is written and organized and designed well. Basically, if you can't envision what you want built, how it will be built, there's a good chance things will go off the rails.

However, there are likely skills that will warrant greater focus, such as:

- Code review. It certainly wouldn't be difficult to generate code for such an interview.
- Management, TL skills. Like reviewing specs and plans. And providing guidance, acceptance criteria, priorities. I think this is what people might consider "prompt engineering" but basically it's this: delegation and being clear about what you want and why.
- Dev experience skills. Like creating linters, setting up docs, etc.
