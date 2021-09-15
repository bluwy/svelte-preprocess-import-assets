<script lang="ts">import ___ASSET___0 from "./foo.mp3";import ___ASSET___1 from "./foo.pdf";import ___ASSET___2 from "./foo.png";import ___ASSET___3 from "./foo.jpg";import ___ASSET___4 from "./foo.mp4";import ___ASSET___5 from "./foo.css";import ___ASSET___6 from "./bar.css";import oh from './no.png';
const foo = 'bar';
</script>

{foo}
<img src={oh} />
<audio src="{___ASSET___0}" />
<embed src="{___ASSET___1}" />
<img src="{___ASSET___2}" />
<img srcset="{___ASSET___2}" />
<input src="{___ASSET___3}" />
<object src="{___ASSET___1}" />
<source src="{___ASSET___4}" />
<source srcset="{___ASSET___4} 500v ./bar.mp4 100v" />
<track src="{___ASSET___0}" />
<video poster="{___ASSET___4}" />
<image href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<use href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<!-- svelte-preprocess-import-assets-ignore -->
<use href="./foo.mp4" xlink:href="./foo.mp4" />
<use href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<img src="./foo.exe" />
<link
  rel="stylesheet"
  href="{___ASSET___5}"
  imagesrcset="{___ASSET___5} 100v, {___ASSET___6} 200v"
/>
<link href="./foo.css" />
<link itemprop="logo" href="{___ASSET___3}" />
<meta name="author" content="Bjorn Lu" />
<meta name="twitter:image" content="{___ASSET___1}" />
<meta property="og:image" content="{___ASSET___2}" />
<meta itemprop="embedurl" content="{___ASSET___0}" />
<img src="https://example.com/foo.png" />

<style lang="scss">img {
  color: #fff;
}</style>
