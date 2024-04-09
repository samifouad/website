<script lang="ts">
	import Blox from './Blox.svelte';
</script>

<div class="wrapper">
  <Blox type="small" tag="201" name="Ch" footer="chinook.app" colour="#009CDF" />
  <Blox type="vertical" tag="106" name="Hr" footer="harar.cloud" colour="#3F6A94" />
  <Blox type="small" tag="117" name="Gi" footer="gild.sh" colour="#B04B5A" />
  <Blox type="hero" tag="105" name="Re" footer="rex.rs" colour="#F78200" />
  <Blox type="small" tag="103" name="Ko" footer="koco.app" colour="#C4787D" />
  <Blox type="hero" tag="203" name="Ba" footer="batteria.app" colour="#749B96" />
  <Blox type="small" tag="207" name="So" footer="systemOp.app" colour="#E8AA5F" />
  <Blox type="small" tag="225" name="Hw" footer="hwd.app" colour="#EF517F" />
</div>

<style>
  @media only screen and (max-width: 480px) {
    .wrapper {
      width: 98%;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 150px;
      grid-gap: 4px;
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
      grid-gap: 4px;
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
      grid-gap: 4px;
      grid-auto-flow: dense;
    }
  }
</style>