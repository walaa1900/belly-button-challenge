// The url data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// the default plots
function init() {

    // Use D3 to read the data from the url
    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let names = data.names;

        // Iterate through the names Array
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Make the demographics panel
function demo(selectedValue) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        
        // Filter data where id 
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]
        
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(obj);
        
        // Add a h5 child element for each key-value pair to the div with id sample-metadata
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries Array
        console.log(entries);
    });
  }
  

// Make the bar chart
function bar(selectedValue) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // An array of sample objects
        let samples = data.samples;

        // Filter data where id  
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        let obj = filteredData[0];
        
        // map for the data for the bar chart
        let map = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "blue"
            },
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", map);
    });
}
  
// Make the bubble chart
function bubble(selectedValue) {

    d3.json(url).then((data) => {

        // An array of sample objects
        let samples = data.samples;
    
        // Filter data where id 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        let obj = filteredData[0];
        
        // Trace for the data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "greens"
            }
        }];
    
        // Apply the x-axis lengend to the layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
 
}

// Make the gauge chart 
function gauge(selectedValue) {
    d3.json(url).then((data) => {
        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id  
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "#013220"},
                steps: [
                    { range: [0, 1], color: "#013220" },
                    { range: [1, 2], color: "#023020" },
                    { range: [2, 3], color: "#43A047" },
                    { range: [3, 4], color: "#43AF50"},
                    { range: [4, 5], color: "#8BC34A" },
                    { range: [5, 6], color: "#CDDC39" },
                    { range: [6, 7], color: "#D2E8BA" },
                    { range: [7, 8], color: "#CDBA88" },
                    { range: [8, 9], color: "#F5F5DC" },
                    { range: [9, 10], color: "#EEE8AA" }
                ]
            }
        }];

         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();