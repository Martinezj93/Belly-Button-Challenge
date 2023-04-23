// BELLY BUTTON CHALLENGE

// Data "samples.json" URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and consol log it
d3.json(url).then(function(data){
    console.log("Data Promise:", data)});

// Function to initialise the dashboard
function init(){

    // Reference the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch JSON data
    d3.json(url).then((data) => {
        
        // Get sample ids/names
        let sampleIds = data.names;
        console.log("Sample IDs:", sampleIds);
        
        // Add sample names to the dropdown menu
        sampleIds.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });
        
        // Set the deafult sample (sample #1)
        let defaultSample = sampleIds[0]
        console.log("Default Sample ID:", defaultSample);

        // Initial plots
        demographicChart(defaultSample);   
        hBarChart(defaultSample)
        bubbleChart(defaultSample)
    });
};

// Function to get the demographicChart
function demographicChart(sample){

    // Fetch JSON data
    d3.json(url).then((data) => {

        // Get metadata
        let metadata = data.metadata;
        
        // Filter based on sample id/name selected
        let id = metadata.filter((idSelected) => idSelected.id == sample);
        
        // Get first object from the array and assign to a variable
        let sampleInfo = id[0]

        // Clear out any current metadata
        d3.select("#sample-metadata").html("");

        // Add key-value pairs to the the chart
        Object.entries(sampleInfo).forEach(([key,value]) => {
            console.log(`Metadata sample ID ${sample}:`, key, value)
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Function to get the hBarChart
function hBarChart(sample){

    // Fetch JSON data
    d3.json(url).then((data) => {
    
        // Get metadata
        let sampleData = data.samples;
        
        // Filter based on sample id/name selected
        let id = sampleData.filter((idSelected) => idSelected.id == sample);
        
        // Get first object from the array and assign to a variable
        let sampleInfo = id[0]

        // Get data for the bar chart
        let sample_values = sampleInfo.sample_values;
        let otu_ids = sampleInfo.otu_ids;
        let otu_labels = sampleInfo.otu_labels;

        // Console log the data
        console.log(`Information Sample ID ${sample}:`, sample_values, otu_ids, otu_labels);

        // Set top 10 OTUs found and display in descending order
        let values = sample_values.slice(0,10).reverse();
        let hovertext = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        console.log(values, hovertext, labels)

        // Trace for the sample data
        let traceBar = [{
            x: values,
            y: hovertext,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        // Apply title to the layout
        let layout = {
            title: `Top 10 OTUs Present in Sample ID ${sample}`
        };

        // Render the plot to div tag with id "bar"
        Plotly.newPlot("bar", traceBar, layout);
    });
};

// Function to get the bubbleChart
function bubbleChart(sample){

    // Fetch JSON data
    d3.json(url).then((data) => {
    
        // Get metadata
        let sampleData = data.samples;
        
        // Filter based on sample id/name selected
        let id = sampleData.filter((idSelected) => idSelected.id == sample);
        
        // Get first object from the array and assign to a variable
        let sampleInfo = id[0]

        // Get data for the bar chart
        let sample_values = sampleInfo.sample_values;
        let otu_ids = sampleInfo.otu_ids;
        let otu_labels = sampleInfo.otu_labels;

        // Trace for the sample data
        let traceBubble = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        // Apply titles to the layout
        let layout = {
            title: `Bacteria in Sample ID ${sample}`,
            xaxis: {title: "OTU ID"},
        };

        // Render the plot to div tag with id "bar"
        Plotly.newPlot("bubble", traceBubble, layout);
    });
};

// Function to update dashboard when a sample ID is selected
function optionChanged(sample){

    // Log the new value
    console.log("Sample ID Selected:", sample); 

    // Call all functions 
    demographicChart(sample);
    hBarChart(sample);
    bubbleChart(sample);
};

// Call init funciton
init();

