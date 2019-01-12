# dplanner

### Code Experiment 0 (Adam R.)

#### What I Built
I decided to play around with getting a directed graph to render in a react component (which will be used to display course maps). It's tricky because a lot of good graphing frameworks, like [d3](https://d3js.org/), need to control the DOM, and React doesn't like to give DOM control to anyone else. I found a pretty nice library for making directed graphs in react, though, called [react-force-graph](https://github.com/vasturiano/react-force-graph), and I used that with some fake data to create a component.

It's super simple but pretty effective and fairly extensible. It's also pretty well-maintained by the author. All good things 😁

#### Who Did What
We split up the code experiments, so I took this one myself.

#### What I Learned
D3 is hard to use with React! There are a few workarounds. The best one I found (that isn't this pre-made component) is to do all the d3 stuff with a fake DOM using [react-faux-dom](https://github.com/Olical/react-faux-dom) and then render it to a react component after the fact. It can work but it's a little messy to work with. If we need to do extensions beyond what this premade component can do then I would recommend that.

The other option is to only use d3's functions for data processing, which don't interface with the DOM at all, and then render the graph with a separate graphics library like [Konva](https://github.com/konvajs/react-konva). This is also workable, but it seems annoying to use two different things for the same process, and also difficult to relate the d3-processed data to something intelligible by Konva, or more accurately, intelligible to the Konva developer.

#### What Didn't Work
I thought about using both the implementations I mentioned above, and began looking at Konva and realized it might be more trouble than it was worth to learn both d3 and konva, since they both have pretty serious learning curves. I actually rendered something successfully using the d3 and react-faux-dom approach, but it was just a standard "Hello, world" (still cool that you can use `node.html` to set html in the d3-bound faux-dom even inside React). I was also wary of investing a bunch of time in learning d3 if it wasn't necessary, so I went back to the drawing board and found this nice component. Worst case we can always go back and learn d3 later, but this library seems good enough for now.