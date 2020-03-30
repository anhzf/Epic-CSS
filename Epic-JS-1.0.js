let currPos = {x: 0, y: 0};
const
	re = {
			between: (x,y) => { return new RegExp(`${x}(.*?)${y}`,'g'); }
		},
	showBenchmark = false

if (showBenchmark) { console.time('Benchmark: ') }

// helper
function streplace(elmt,replaced,replace) {
	let ori = line.textContent.match(re.between("\\[{1}","\\]{1}"));
	if (ori) { for (x of ori) elmt.innerHTML = elmt.textContent.replace(replaced,replace) }
}

// DOM helper
function createNewElement(tag,data,appendTo,...classes) {
	let nw = document.createElement(tag);
	nw.textContent = data;
	if ([...classes].length > 0) nw.classList.add(...classes);
	appendTo.appendChild(nw);
	return nw;
}
function toggleClass(...arrayElmAndClasstoToggle) {
	// example
	//  var = new toggle([form, ["disappear"]], [document.getElementById("resp"), ["disappear"]])
	// 	@arg is array. first is node. second is array of class want to toggle
	this.dat = arrayElmAndClasstoToggle
	this.off = () => this.dat.forEach(elm => elm[0].classList.remove(elm[1]))
	this.on = () => this.dat.forEach(elm => elm[0].classList.add(elm[1]))
	this.now = () => {
		this.dat.forEach(elm => {
			elm[1].forEach(classes => { 
				if (elm[0].classList.contains(classes)) elm[0].classList.remove(classes)
				else elm[0].classList.add(classes)
			})
		});
	};
}

// DOM manipulation
function Table(data, tbl = document.createElement("TABLE"), options = {}) {
	this.data = data,
	this.options = options,
	this.elm = tbl,
	this.elmRow = this.elm.rows;

	if ("class" in this.options) this.elm.classList.add(...this.options.class)
	if ("title" in this.options) this.elm.createCaption().textContent = this.options.title

	this.create = () => {
		let heads = body = []
		// Create Head
		this.elm.createTHead()
		this.data.forEach(row => heads = heads.concat(Object.keys(row)))
		heads = [...new Set(heads)]
		rw = this.elm.tHead.insertRow()
		heads.forEach(head => createNewElement('TH',head,rw))
		// Create Body
		this.elm.createTBody()
		this.data.forEach(row => body.push(heads.slice().map(col => { return col in row ? row[col] : null }))) // Make undefined key to be null cell
		body.forEach(row => this.addRow(row))
	}
	this.addRow = (arrOfCell,toPart = this.elm.tBodies[0]) => {
		let row = toPart.insertRow()
		arrOfCell.forEach(cell => (row.insertCell()).innerHTML = cell)
	}
}

// specified function
function loader(appendTo = document.body, loaderElement) {
	this.appendTo = appendTo
	if (this.loaderElement) this.loaderElement = loaderElement
	else {
		this.loaderElement = document.createElement("DIV")
		this.loaderElement.classList.add("loader-container")
		createNewElement("DIV", null, createNewElement("DIV", null, this.loaderElement, "line-loader"), "line");
	}
	this.isLoad = () => this.appendTo.appendChild(this.loaderElement)
	this.isLoaded = () => this.loaderElement.remove()
}
function toolTips() {
	document.querySelectorAll("[data-tooltip]").forEach(elmt => {
		let tElmt;
		elmt.addEventListener("mouseenter", e => {
			tElmt = createNewElement("DIV",elmt.dataset.tooltip, document.body, "tooltip");
			tElmt.style.left = `${e.clientX - tElmt.getBoundingClientRect().width / 3}px`;
			currPos.y = e.clientY + 10;
			((currPos.y + tElmt.getBoundingClientRect().height) >= window.innerHeight) ? tElmt.style.top = (currPos.y - (elmt.getBoundingClientRect().height * 2.1))+"px" : tElmt.style.top = (currPos.y)+"px"
		})
		elmt.addEventListener("mouseleave", () => tElmt.remove());
	})
}
function modal() {
	const modElmt = document.querySelector("div.modals");
	
	this.close = () => { modElmt.classList.remove("open") }
	this.open = () => { modElmt.classList.add("open") }
}
function code() {
	const codeBlock = [].slice.call(document.querySelectorAll("code"));
	codeBlock.forEach((block) => {
		const ctn = block.textContent, re = /(<((\/)?([a-z]*)(\s*(([^>]*))+)*)?>)/gi;
		if (block.querySelectorAll("*").length === 0) {
			const sep = ctn.split(/\n/g).filter(ssep => /\S/g.test(ssep)); block.textContent = null;
			if (sep.length > 0) { sep.forEach(ssep => createNewElement("DIV",ssep,block));
			} else { createNewElement("DIV",ctn,block) }
		}
	});
}

// const mod = new modal();

// function tblEdit(elmt) {
// 	this.elmt = elmt;
// 	this.ctn = new Object(this.elmt.querySelector('tbody').children);
// 	const dElmt = document.querySelector('ul.tblEdit-dialog');
// 	Object.values(this.ctn).forEach(function (tr) {
// 		tr.addEventListener("click", function (e) {
// 			currPos.y = tr.getBoundingClientRect().y;
// 			currPos.x = e.clientX;
// 			dElmt.style.display = "unset";
// 			dElmt.style.top = (currPos.y - (tr.getBoundingClientRect().height))+"px";
// 			dElmt.style.left = (currPos.x - (dElmt.getBoundingClientRect().width / 2.5))+"px";
// 			setTimeout(function () {
// 				dElmt.style.display = "none";
// 			}, 5000);
// 		});
// 	});
// }
	// this.val = new Object(this.row);

if (showBenchmark) { console.timeEnd('Benchmark: ') }