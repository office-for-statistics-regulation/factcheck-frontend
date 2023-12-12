<script>

	import { navigating } from '$app/stores';
    import { fade } from 'svelte/transition';
	import Header from './Header.svelte';
	import './styles.css';

	let username = "";
    let password = "";
	// let loggedin = false;
	let loggedin = true;
	const isProduction = process.env.NODE_ENV === 'production';

	if (isProduction) {
		loggedin = false;
	}


    function handleLogin() {
        if (username === "statsregulation" && password === "getdata") {
            alert("Logged in successfully!");
			loggedin = true;
        } else {
            alert("Incorrect username or password!");
        }
    }



</script>




{#if !loggedin}
	<div class="container">
		<h1>Please log in</h1>
		<form on:submit|preventDefault={handleLogin}>
			<div>
				<label for="username">Username: </label>
				<input type="text" id="username" bind:value={username} required>
			</div>
			<div>
				<label for="password">Password: </label>
				<input type="password" id="password" bind:value={password} required>
			</div>
			<button type="submit">Login</button>
		</form>
	</div>
{:else}


	<div class="app">
		<Header />

		<main>

			{#if $navigating}
				<div in:fade={{duration: 200}} style="width: max-content;margin: 105px auto;">
					Loading...
				</div>
			{:else}
				<slot />
			{/if}
		</main>
	</div>
{/if}
<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 98%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
	.container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

</style>
