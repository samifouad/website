<script>
	 export let type = "small"
	 export let tag = "Sf"
	 export let name = "Sami"
	 export let footer = ""
	 export let url = ""
	 export let colour = ""
</script>

{#if type === 'profile'}
	<div class="item rounded-[18px] w-full h-full leading-[128px]" style="background: {colour}">
		{name}
	</div>
{/if}

{#if type === 'small'}
		<a href="/projects/{url}">
		{#if tag && name && footer}
			<div class="tag">{tag}</div>
			<div class="bname" style="font-size: 38px;">{name}</div>
			<div class="bfooter">{footer}</div>
		{/if}
		</a>
{/if}

{#if type === 'micro'}
		<a href="/projects/{url}">
		{#if footer}
			<div class="bname-micro" style="font-size: 14px; height: 100%">{footer}</div>
		{/if}
		</a>
{/if}

{#if type === 'vert'}
		<a href="/projects/{url}">
		{#if tag && name && footer}
			<div class="tag">{tag}</div>
			<div class="bname" style="font-size: 52px;">{name}</div>
			<div class="bfooter">{footer}</div>
		{/if}
		</a>
{/if}

{#if type === 'hero'}
			<a href="/projects/{url}">
			{#if tag && name && footer}
				<div class="tag">{tag}</div>
				<div class="bname" style="font-size: 96px;">{name}</div>
				<div class="bfooter">{footer}</div>
			{/if}
			</a>
{/if}


<style>
	@media only screen and (max-width: 480px) {
	.item {
		position: relative;
		color: white;
		background: #f9f9f9;
		padding: 0px;
	}
	.item:nth-child(even) {
		background: #ececec;
	}
	.item:hover {
		cursor: pointer;
	}
}
@media only screen and (min-width: 481px) {
	.item {
		position: relative;
		color: white;
		background: #f9f9f9;
		padding: 0px;
	}
	.item:nth-child(even) {
		background: #ececec;
	}
	.item:hover {
		cursor: pointer;
	}
}
@media only screen and (min-width: 630px) {
	.item {
		position: relative;
		color: white;
		padding: 0px;
		scale: 1.0;
		text-align: center;
		transition-duration: 0.2s;
	}
	.item:hover {
		cursor: pointer;
	}
}
	.tag {
		display: block;
		width: 100%;
		text-align: left;
		color: #ffffff;
		text-shadow: 1px 1px 0px rgba(0, 0, 0, 1);
		font-size: 0.8rem;
		height: 1.5rem;
		padding-top: 12px;
		padding-left: 16px;
		opacity: 0.80;
	}

	.bname {
		display: flex;
		height: calc(100% - 3rem);
		font-family: 'Teko', sans-serif;
		align-items: center;
		color: #fdfdfd;
		justify-content: center;
	}

	.bname-micro {
		display: flex;
		height: calc(100% - 3rem);
		font-family: 'Teko', sans-serif;
		align-items: center;
		color: #6082B6;
		justify-content: center;
	}

	.bfooter {
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: right;
		color: #fdfdfd;
		text-shadow: 1px 1px 0px rgba(0, 0, 0, 1);
		font-size: 0.7rem;
		height: 1.5rem;
		padding-bottom: 15px;
		padding-right: 10px;
		opacity: 0.90;
	}
</style>