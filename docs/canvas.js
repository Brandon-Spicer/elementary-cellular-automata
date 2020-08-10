var canvas = document.querySelector('canvas')
canvas.width = 500 
canvas.height = 500

var c = canvas.getContext('2d')

// elementary cellular automaton generator
// input seed, rule, and optional halting condition
// yield the next state of the cellular automaton
function* eca(seed, rule, stop=-1) {
	count = 0

	// rule_map[neighborhood of cell] -> next state for cell
	rule_map = new Array(8)
	for (i=0; i<8; i++) {
		rule_map[i] = Math.floor(rule / 2**i) % 2
	}

	while (count != stop) {
		count += 1
		// if just starting, yield initial state
		if (count == 1) {
			yield seed

		} else {
			next_state = seed.slice()
			for (let i=0; i<seed.length; i++) {
				// get neighborhood
				hood = []
				for (let j=-1; j<2; j++) {
					idx = (i - j) % seed.length
					if (idx < 0) {
						idx = seed.length + idx
					}
					hood.push(seed[idx])
				}

				// get rule index from neighborhood values
				rule_index = 0
				for (let k=0; k<3; k++) {
					rule_index += hood[k] * (2**k)
				}
				// update next state
				next_state[i] = rule_map[rule_index]
			}

			// transition state
			seed = next_state
			
			// generator yield
			yield seed 
		}
	}
}

function resetButton() {
	// initialize generator and memory
	seed = new Array(50).fill(0)
	seed[24] = 1
	bar = eca(seed, 126);
	mem = new Array()
	// clear the canvas
	c.clearRect(0, 0, canvas.width, canvas.height)

}

// next button
function nextButton() {
	console.log(Math.random())

	// drawing size parameter
	d = 10

	// push next state to memory
	mem.push(bar.next().value)

	// draw nRows states from memory
	nRows = 50 
	for (let j=0; j<nRows; j++) {

		// draw this row:
		if (mem.length-1-j >= 0) {
			toDraw = mem[mem.length-1-j]
			for (let k=0; k<toDraw.length-1; k++) {
				// kth column of row
				x = k*d
				// jth row
				y = j*d

				c.beginPath()
				c.rect(d + x, d*(nRows-1)-y, d, d)
				if (toDraw[k] == 1) {
					c.fillStyle = 'red'
				} else {
					c.fillStyle = 'white'
				}
				c.fill()
				c.stroke()
			}
		}
	}
}


// initialize
resetButton()


