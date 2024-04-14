<script>
	import Blox from './Blox.svelte'

  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  export let projects = {}

 shuffle(projects)
</script>

<div class="wrapper">
  {#each projects as { size, code, tag, title, url, colour }}
    <Blox type="{ size }" tag="{ code }" name="{ tag }" footer="{ title }" url="{ url }" colour="{ colour }" />
  {/each}
</div>

<style>
  @media only screen and (max-width: 480px) {
    .wrapper {
      width: 98%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 150px;
      grid-gap: 8px;
      grid-auto-flow: dense;
    }
  }

  @media only screen and (min-width: 481px) {
    .wrapper {
      width: 98%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat( auto-fit, minmax(200px, 3fr) );
      grid-auto-rows: 150px;
      grid-gap: 8px;
      grid-auto-flow: dense;
    }
  }

  @media only screen and (min-width: 630px) {
    .wrapper {
      width: 98%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat( auto-fit, minmax(200px, 3fr) );
      grid-auto-rows: 150px;
      grid-gap: 8px;
      grid-auto-flow: dense;
    }
  }
</style>