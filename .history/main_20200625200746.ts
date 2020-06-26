const url = Deno.args[0];

async function main() {
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}
