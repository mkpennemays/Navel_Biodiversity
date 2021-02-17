var subjectIds;
var metadata;
var samples;
var currSubj;

function init(){
    console.log('init');
    d3.json("./data/samples.json").then(function(data) {
    subjectIds =data.names;
    metadata = data.metadata;
    samples = data.samples;
    console.log(samples[0]);
    loadDropdown(subjectIds);
      }); 
}

function loadDropdown(idArr){
    //load all the ides into the id select dropdown
    let dropdown = document.getElementById("selDataset")
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Id';
    
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    let option;
    for (let i = 0; i < idArr.length; i++) {
        option = document.createElement('option');
        option.text = idArr[i];
        option.value = idArr[i];
        dropdown.add(option);
      }  

}

function subjIdChanged(subjectId) {
    /* metadata consists of:
        age, bbtype (Innie or Outie), ethnicity, gender, location, wfreq(scrubs/week)
    */
    var subjectMetaData = metadata.filter(data => data.id == subjectId);

    let demoData = subjectMetaData[0];
    let metaDataPanel = document.getElementById("sample-metadata")
    let demographics = "age: " + demoData.age + "<br>"
    demographics = demographics + "gender: " + demoData.gender + "<br>";
    let bbType = "";
    (demoData.bbtype == 'I') ? bbType = "Innie" : bbType = "Outie";
    demographics = demographics + "belly button type: " + bbType + "<br>";
    demographics = demographics + "scrubs/week: " + demoData.wfreq + "<br>";    
    demographics = demographics + "ethnicity: " +demoData.ethnicity + "<br>";
    demographics = demographics + "location: " +demoData.location + "<br>";

    metaDataPanel.innerHTML = demographics;
    /*load bar
    //Use sample_values as the values for the bar chart.
    //Use otu_ids as the labels for the bar chart.
    //Use otu_labels as the hovertext for the chart.
    */
    var subjectSamples = samples.filter(sampleData => sampleData.id == subjectId);

    let idArr = subjectSamples[0].otu_ids;
    console.log(idArr);
    let otu_id_strs = [];
    for(let i = 0; i < idArr.length;i++){
        otu_id_strs[i] = "otu_" + idArr[i];
    }
    console.log(otu_id_strs);
    
    var trace1 = {
        y: otu_id_strs.slice(0,10),
        x: subjectSamples[0].sample_values.slice(0,10),
        text:subjectSamples[0].otu_labels.slice(0,10),
        name: "Yuck",
        type: "bar",
        orientation: 'h'
      };
    // Apply the group barmode to the layout
    var layout = {
        title: "Gross stuff",
        barmode: "group"
        }

    var traceData = [trace1];
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", traceData, layout);

    //load gauge
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: demoData.wfreq,
        title: { text: "scrubs/week" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 3 },
        gauge: { axis: { range: [null, 7] },
          'steps' : [
              {'range': [0, 2], 'color': "brown"},
              {'range': [2, 4], 'color': "gray"},
              {'range': [4, 6], 'color': "lightgray"},
              {'range': [6, 7], 'color': "white"}], }
      }
    ];
    
    var layout = { width: 400, height: 300 };
    Plotly.newPlot('gauge', data, layout);

    //load bubble
    /*
    Use otu_ids for the x values.
    Use sample_values for the y values.
    Use sample_values for the marker size.
    Use otu_ids for the marker colors.
    Use otu_labels for the text values.
    */
    var trace1 = {
        x: subjectSamples[0].otu_ids,
        y: subjectSamples[0].sample_values,
        text:subjectSamples[0].otu_labels,
        mode: 'markers',

        marker: {
          size: subjectSamples[0].sample_values,
          color: subjectSamples[0].otu_ids,
          colorscale:'Rainbow'
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);


}

init();


