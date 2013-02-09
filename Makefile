SRC=src/msac.jquery.js
DEST=build/msac.jquery.min.js
FLAGS=--lint --mangle --compress

all:
	@echo "Building $(SRC) into $(DEST)..."
	@uglifyjs $(SRC) -o $(DEST) $(FLAGS)
	@echo "Done."
