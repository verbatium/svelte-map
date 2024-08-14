<script lang="ts">
	async function login(form: HTMLFormElement) {
		try {
			form.submit();
		} catch (err) {
			console.error(err);
		}
	}
</script>

<form action="/auth/login/tesla" method="post" on:submit|preventDefault={(e) => login(e.currentTarget)}>
	<input name="token" type="hidden" />
	<button class="border rounded p-2 mt-10 bg-gray-800 text-white hover:bg-gray-700">
		Login using Tesla
	</button>
</form>