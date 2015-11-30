var PROJECT_DATA_MAPPER = 
{
    rawProjectJsonData : {},
    projectsByCountryHash : {},
    
    init : function(){
        this.loadData();
    },
    
    loadData : function(){
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                //alert(xhr.responseText);
                PROJECT_DATA_MAPPER.rawProjectJsonData = JSON.parse(xhr.responseText);
                PROJECT_DATA_MAPPER.parseDataIntoHash();
                createD3Map();
            }
        };
        
        xhr.open('GET', 'json_sample_data/aptivate_projects.json', true);
        xhr.send(null);
    },
    
    parseDataIntoHash : function(){
        var arrayToProcess = this.rawProjectJsonData.projectItemsArray;
        for(var i = 0; i < arrayToProcess.length; i++){
            var currProjectData = arrayToProcess[i];
            var currCountryData = currProjectData.projectCountriesArray;
            for(var j = 0; j < currCountryData.length; j++){
                var currCountryCode = currCountryData[j];
                if(!this.projectsByCountryHash[currCountryCode]){
                    this.projectsByCountryHash[currCountryCode] = [];
                }
                this.projectsByCountryHash[currCountryCode].push(currProjectData);
            }
        }
        
    },
    
    getProjectsByCountryCode : function(countryCode){
        if(this.projectsByCountryHash[countryCode]){
            return this.projectsByCountryHash[countryCode];
        }
        return [];
    },
    
    getPopUpContentsByCountryCode : function(countryCode){
        var relatedProjectsArray = this.getProjectsByCountryCode(countryCode);
        
        if(relatedProjectsArray.length == 0){
            return false;
        }        
       
        
        var returnContent = "<h2>Projects in this country:</h2><dl>";
        for(var i = 0; i < relatedProjectsArray.length; i++){
            returnContent += "<dt>Project name:</dt><dd>" + relatedProjectsArray[i].projectName + "</dd>";
        }
        returnContent += "</dl>";
        
        return returnContent;
    }
    
};
