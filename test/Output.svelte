<script lang="ts">
import ___ASSET___0 from "./foo.mp3";
import ___ASSET___1 from "./foo.pdf";
import ___ASSET___2 from "./foo.png";
import ___ASSET___3 from "./foo.jpg";
import ___ASSET___4 from "./foo.mp4";
import ___ASSET___5 from "./bar.mp4";
import ___ASSET___6 from "./foo.css";
import ___ASSET___7 from "./bar.css";
  
import oh from './no.png'
  const foo: string = 'bar'
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
<source srcset="{___ASSET___4}, {___ASSET___5} 1v" />
<track src="{___ASSET___0}" />
<video poster="{___ASSET___4}" />
<video src="{___ASSET___4}" />
<image href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<use href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<!-- svelte-preprocess-
import-assets-ignore -->
<use href="./foo.mp4" xlink:href="./foo.mp4" />
<use href="{___ASSET___4}" xlink:href="{___ASSET___4}" />
<img src="./foo.exe" />
<link
  rel="stylesheet"
  href="{___ASSET___6}"
  imagesrcset="{___ASSET___6} 100v, {___ASSET___7} 200v"
/>
<link href="./foo.css" />
<link itemprop="logo" href="{___ASSET___3}" />
<meta name="author" content="Bjorn Lu" />
<meta name="twitter:image" content="{___ASSET___1}" />
<meta property="og:image" content="{___ASSET___2}" />
<meta itemprop="embedurl" content="{___ASSET___0}" />
<img src="https://example.com/foo.png" />
<Image src="{___ASSET___2}" />
<Img src="./bar.png" />

<!-- https://github.com/bluwy/svelte-preprocess-
import-assets/issues/4 -->
<!-- mathjax or image sprite sheet patterns reference the sprites with an id, preprocess should ignore them -->
<p>
  <span class="math display math-display">
    <mjx-container class="MathJax" jax="SVG" display="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="46.546ex"
        height="2.262ex"
        role="img"
        focusable="false"
        viewBox="0 -750 20573.1 1000"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <path
            id="MJX-1-TEX-I-1D465"
            d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"
          />
        </defs>
        <g
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          transform="scale(1,-1)"
        >
          <g data-mml-node="math">
            <g data-mml-node="mi">
              <use data-c="1D465" xlink:href="#MJX-1-TEX-I-1D465" />
            </g>
          </g>
        </g>
      </svg>
    </mjx-container>
  </span>
</p>

<style lang="scss">
  $text-color: #fff;
  img {
    color: $text-color;
  }
</style>
