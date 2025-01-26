# AI Learnings

Scratch document for my thoughts on AI and how it relates to web development.

## How I'm Using AI

I'm keeping it fairly simple. I'm mainly using Claude Sonnet, either directly through their website or with the Cursor code editor.

### For Code

The classic use case for AI - the auto-complete. This certainly helps move things along; I will often have an intention to add some code, such as by adding a parameter to a function or creating a variable, and it will provide the functionality. Or I'll start to make a series of repetitive changes, and it will handle that, where before I'd have used some sort of multi-cursor feature. Sometimes it will not suggest the right thing, or want to add things I don't want added, but it's not too hard to ignore those suggestions.

### For Unfamiliar Tools

This has been a bit less helpful, and seems like one of the main ways AI can lead a codebase to ruin. Some instances:

- I wasn't sure how to set up an nginx conf, and it generated one that I had no confidence in its performance, security, or ability to do what I wanted.
- I hadn't used vuetify before, and I asked it to create a landing page. It made an overly complicated page using a vuetify-grid-row-column layout with a single cell, and nothing was centered. Well, I can empathize there.
- I hadn't gotten very much practice with more advanced TypeScript features like generics, and I tried to set up a way to lookup the request and response types for express routes. It made something overly complicated and verbose using a function which should never be called and ReturnType.

In all these cases, I stopped what I was doing and went elsewhere. I found Mozilla's recommended nginx config tool, and read through Vuetify and TypeScript's documentation and came up with better solutions.

I'm kind of curious what a better approach would be here. If the AI were a junior dev, I'd press them to critically assess what they produced, spend more time learning the tools they're trying to weild, you know, coach them. But there's no point in doing that with Claude.

I might still try that. I did that a bit with nginx, where I found what I thought might be a bug and it indeed was. Claude fixed it when I pointed it out. Perhaps I can do a bit more back and forth where my intuition is what they produce is sub-optimal. But then, it seems easier and a better long-term solution for me to spend the few hours to get at least basically familiar with a tool, so I can prompt better usage more directly. And if I don't at least skim through the documentation of a tool, I feel ill-equipped to use it.

That need to understand the tool better might be an opportunity to optimize here. Can I write a website with vuetify without even having skimmed the docs? It's hard to imagine, but if one can reduce the depth of knowledge of all the tools involved in building a website that is necessary to be effective, by using an AI for deep knowledge, then you can go a fair bit faster I think. Then you can reduce the skill/knowledge that you need to bring to:

- Can you tell what the code is doing? Either through the names/docs of the library itself, or with added comments.
- Can you identify when something feels hacky and/or overly complicated? Improper use of a tool.

In this way, perhaps you can assess the output of the AI without ever having deeply learned the tool they're using.

### For Software Design

Taking it a bit of a step up building small functionality, it's been useful to lean on AI for figuring out how to refactor and structure things. `TODO`

### For Architecture

`TODO`
