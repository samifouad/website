<script>
  export let lang = {};

  import colours from "../helpers/colous.json"
  import lookup from '../helpers/lookup'

  const get_hex = lookup(colours);

  const total = Object.values(lang).reduce((sum, value) => sum + value, 0);

</script>

<div class="w-[80%] relative mx-auto box-border rounded-md overflow-hidden">
  {#each Object.entries(lang) as [key, value]}
    <div
      style="width:{Math.round((value / total) * 100) > 50 ? Math.round((value / total) * 100) - 1 : Math.round((value / total) * 100)}%; 
            background-color:{get_hex(key)}" 
      class="float-left min-h-[10px] box-border"
      title={key}
    >
    </div>
  {/each}
</div>
