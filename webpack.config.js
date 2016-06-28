module.exports={
	entry: "./src/App.jsx",
	output: {
		filename:"public/bundle.js"
	},
	
	module:{
		loaders:[
			{
				test:/\.jsx?$/,
				exclude: /node_modules/,
				loaders:['babel']
			}
		]
	},
};