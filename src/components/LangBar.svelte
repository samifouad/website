<script>
  export let lang = {};

  import colours from "../helpers/colous.json"
  import lookup from '../helpers/lookup'

  const get_hex = lookup(colours);

  const total = Object.values(lang).reduce((sum, value) => sum + value, 0);

  const percentages = Object.values(lang).map((l) => {
    return Math.round((l / total) * 100)
  })

  const vary = (Object.values(percentages).reduce((sum, value) => sum + value, 0))-100

  let adjustment
  let amount

  switch (vary) {
    case 0:
      adjustment = 'none'
    break;
    case 1:
      adjustment = 'subtract'
      amount = 1
    break;
    case 2:
      adjustment = 'subtract'
      amount = 2
    break;
    case 3:
      adjustment = 'subtract'
      amount = 3
    break;
    case -1:
      adjustment = 'add'
      amount = 1
    break;
    case -2:
      adjustment = 'add'
      amount = 2
    break;
    case -3:
      adjustment = 'add'
      amount = 3
    break;
    default:
      adjustment = 'none'
    break;
  }

  const adjusted_percentages = Object.fromEntries(Object.entries(lang).map(([key, value]) => {
    return [key, Math.round((value / total) * 100)]
  }))

  //console.log(adjusted_percentages)

    let maxKey = null;
    let maxValue = -Infinity; // Start with the smallest possible value

    for (const [key, value] of Object.entries(adjusted_percentages)) {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }

    //console.log(`Key with the highest value: ${maxKey}`);
    //console.log(`Highest value: ${maxValue}`);

    let final_list

    switch (adjustment) {
      case 'none':
        final_list = adjusted_percentages
      break;
      case 'add':
        final_list = { ...adjusted_percentages, [maxKey]: maxValue + amount }
      break;
      case 'subtract':
        final_list = { ...adjusted_percentages, [maxKey]: maxValue - amount }
      break;
      default:
        final_list = adjusted_percentages
      break;
    }

  //console.log(final_list)
</script>

<div class="w-[80%] relative mx-auto box-border rounded-md overflow-hidden">
  {#each Object.entries(final_list) as [key, value]}
    <div
      style="width:{value}%; 
            background-color:{get_hex(key)}" 
      class="float-left min-h-[10px] box-border"
      title={key}
    >
    </div>
  {/each}
</div>
