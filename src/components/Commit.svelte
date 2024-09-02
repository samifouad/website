<script lang="ts">

export let data

let url = '/projects/'+ data.repo.split('/')[1]

const date = new Date(data.date);
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const friendlyDate = date.toLocaleDateString('en-US', options);

</script>

<div class="w-[96%] md:w-[80%] m-auto bg-white rounded-[12px] p-2 pl-4 pb-4 pt-3 border-2 border-[#EFEFEF]">
<div class="flex items-center">
	<img src="{data.avatar}" class="w-[30px] h-[30px] rounded-full mr-4" alt="{data.name}">
	<span class="text-sm">{data.name} made a commit to <a href="{url}">{data.repo}</a></span>
</div>
<div class="">
	<span class="inline-block text-2xl pt-4 pb-4">{data.message}</span>
</div>
<div class="flex items-center">
	<span class={`rounded-[12px] text-xs pt-1 pb-1 pl-4 pr-4 border-opacity-50	 border 
	    ${data.verified ? 'text-green-600 border-green-700' : 'text-red-100 border-red-100 bg-red-600'}`}
	>
	  {data.verified ? 'Verified' : 'Not Verified'}
	</span>
	<span class="ml-4 text-xs">
		<a href="https://github.com/{data.repo}/commit/{data.sha}" target="_new">{data.sha.slice(0, 7)}</a>
	</span>
	<span class="ml-4 text-sm text-bold">
		<span class="text-green-500">+{data.stats.additions.toLocaleString('en-US')}</span>
		<span class="text-red-500">-{data.stats.deletions.toLocaleString('en-US')}</span>
	</span>
	<span class="ml-4 text-sm text-bold">
		{friendlyDate}
	</span>
</div>
</div>
