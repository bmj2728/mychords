Goal: Create a self-hosted alternative to Ultimate Guitar implementing only the most useful functionality: Chord/Tab file support, Songs grouped by artist, search by artist or song, display file. We'd also like to implement Autoscroll as a must have feature. The transpose function is also desired for chord files. Tech stack here should consider potential enhancements to document metadata. My suggestion is that we consider a Go or node backend, React front end w/ tailwind, and consider different storage options. Consider the nature of the application, there's likely a strong case for something like MongoDB + GridFS as a way to support both our storage + search capabilities, though I value your input. Though, we're dealing with fairly small files, and simple metadata, so local storage and a sqlite db may be more appropriate. Let's primarily be concerned with getting it to work in our local dev environment before worrying about how we'll deploy in the future.


Chord example:

![7158d81b89b73ecd9fceb67168edb95b.png](/concept/7158d81b89b73ecd9fceb67168edb95b.png)

![ad78a213ab752fa911fa6fcf241392d3.png](/concept/ad78a213ab752fa911fa6fcf241392d3.png)

Transposed:

![42d36946fed2d38b59d4c648b1952398.png](/concept/42d36946fed2d38b59d4c648b1952398.png)

Tab example:

![3c4d0a429b7d378ae38a18d8e7dab1ba.png](/concept/3c4d0a429b7d378ae38a18d8e7dab1ba.png)