let RESULTS = 6
let BASE = "https://developer.mozilla.org"
// idea: give priority to matches which start with \b
let SEARCH = (text)=>{
	return page => page.title.toLowerCase().includes(text)
}

browser.omnibox.setDefaultSuggestion({description: "🅼 Search MDN"})

function filter_n(array, limit, test) {
	let res = []
	array.find( x => test(x) && res.push(x)>=limit )
	return res
}
//https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
browser.omnibox.onInputChanged.addListener((text, suggest)=>{
	let items = filter_n(INDEX, RESULTS, SEARCH(text)).map((page)=>{
		let p = page.url.split("/")
		let z = {
			docs: {
				Web: {
					CSS: "🟦",
					HTML: "🟥",
					API: "🟨",
					Javascript: "🟨",
					Events: "🟨",
				}
			}
		}[p[2]]?.[p[3]]?.[p[4]] ?? ""
		return {
			content: "\u200B"+page.url,
			description: z+" "+page.title,
		}
	})
	suggest(items)
})

// Open the page based on how the user clicks on a suggestion.
browser.omnibox.onInputEntered.addListener((text, disposition)=>{
	if (text.startsWith("\u200B"))
		text = text.substr(1)
	else
		text = "/en-US/search?q="+encodeURIComponent(text)
	console.log("entered text", text)
	
	let func = {
		currentTab: url => browser.tabs.update({url}),
		newForegroundTab: url => browser.tabs.create({url}),
		newBackgroundTab: url => browser.tabs.create({url, active: false}),
	}[disposition]
	
	func(BASE + text)
})
