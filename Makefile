
build:
	pnpm install  --force
	#pnpm run build
	./node_modules/.bin/vercel build --version
