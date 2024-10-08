rm -f packages/*/*.tgz

for package in packages/*; do
	(cd $package && pnpm pack)
done

for tarball in packages/*/*.tgz; do
	echo "pnpm add $(realpath $tarball)"
done
