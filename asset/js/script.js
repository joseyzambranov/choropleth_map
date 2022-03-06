async function run() {
    
const urlEduData =await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")

const urlCountieData = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")

const edu = await urlEduData.json()

const countie = await urlCountieData.json()

const edumin = d3.min(edu,e=>e.bachelorsOrHigher)
const edumax = d3.max(edu,e=>e.bachelorsOrHigher)
const step = (edumax-edumin)/8

const color=[]



const colorScale = d3.scaleThreshold()
.domain(d3.range(edumin,edumax,step))
.range(d3.schemeOranges[9])

for (var i = edumin;i<=edumax;i+=step){
    color.push(colorScale(i))
}

const width=960;
const height=550;

const path = d3.geoPath();
const data = topojson.feature(countie,countie.objects.counties).features

const svg = d3.select("#container").append("svg")
              .attr("width",width)
              .attr("height",height)

svg.append("g")
   .selectAll("path")
   .data(data)
   .enter()
   .append("path")
   .attr("class","county")
   .attr("fill",d=>colorScale(edu.find(edu => edu.fips === d.id).bachelorsOrHigher))
   .attr("d",path)
   .attr("data-fips",d=>d.id)
   .attr("data-education",d=>edu.find(edu=>edu.fips===d.id).bachelorsOrHigher)
   .on("mouseover",(d,i)=>{
       const {coordinates} = d.geometry
       const [x,y]= coordinates[0][0]
       const education = edu.find(edu=>edu.fips===d.id)

    tooltip.classList.add("show")
    tooltip.style.left = x-50 +"px"
    tooltip.style.top = y-50+"px"
    tooltip.setAttribute("data-education",education.bachelorsOrHigher)
    console.log(education)
    tooltip.innerHTML=`
    <p>${education.area_name}-${education.state}</p>
    <p>${education.bachelorsOrHigher}%</p>
    `
   })
   .on("mouseout",()=>{
    tooltip.classList.remove("show")
})
/*lengend*/

let lengWidth = 500
let lengHeight = 30

let lengRectWidth = lengWidth/ color.length
const legend = d3.select(".leg")
               .append("svg")
               .attr("id","legend")
               .attr("width",lengWidth)
               .attr("height",lengHeight)
               .selectAll("rect")
               .data(color)
               .enter()
               .append("rect")
               .attr("x",(_,i)=>i*lengRectWidth)
               .attr("y",0)
               .attr("width",lengRectWidth)
               .attr("height",lengHeight)
               .attr("fill",c=>c)


   
}

run()