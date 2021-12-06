import React, { Component } from 'react'
import{View, StyleSheet,Text, Image, Animated,
    ImageBackground, Dimensions,ScrollView,TouchableOpacity,
    TouchableHighlight} from 'react-native';

const deviceWidth=Dimensions.get('screen').width;
const deviceHigth=Dimensions.get('screen').height;


export default class BackGroundCorsoul extends Component {
    
    scrollRef=React.createRef();
    constructor(props){
        super(props)
        this.state={
            selectedIndex:0,
            
        }
    }
     componentDidMount=()=> {this.back()}

     back=()=>{  setInterval(()=>{
            this.setState(prev=>({selectedIndex:prev.selectedIndex === 
                this.props.images.length -1 ? 
                0
                :prev.selectedIndex +1}),
            ()=>{
                this.scrollRef.current.scrollTo({
                    animated:true,
                    y:0,
                    x:deviceWidth*this.state.selectedIndex
                }
                );
            }
            )
        },5000
       )
     }
    selected=(event)=>{
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const offSet = event.nativeEvent.contentOffset.x;
       const selectedIndex=Math.floor(offSet/viewSize);
       this.setState({selectedIndex})
    //console.log(viewSize)
    }
    render() {
       
        const {imag}=this.props;
        const {selectedIndex}=this.state;
        return (
            <View style={StyleSheet.container}>
                <View style={styles.one}>
                    <ScrollView  horizontal={true} pagingEnabled={true}
                     onMomentumScrollEnd={this.selected}
                        style={styles.imageVies}
                        ref={this.scrollRef}
                        >
                    {this.props.images.map((img,i)=>{
                        return(
                            
                            <ImageBackground key={i}
                             style={{width:deviceWidth, height:null,
                                 resizeMode:"cover", zIndex:20}}  
                                  source={{uri:img.path}}> 
                                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('SingleVendor',{'id':img.id})} style={{width:"100%",
                                   height:"100%"}}>

                                  </TouchableOpacity>
                             </ImageBackground>
                               
                                
                        )
                    })}
                      </ScrollView> 
                     
                </View>
                <View style={{width:"100%", height:20,}}>
                <View style={styles.circleView}>
                          {
                              this.props.images.map((imag,i)=>{
                                  return(
                                    <View key={imag.id}  
                                    style={[styles.dot,
                                    {backgroundColor:i === selectedIndex ?"red": "green"},
                                    {width:i === selectedIndex ? 7: 5},
                                    {height:i === selectedIndex ? 7: 5},
                                    {borderRadius:i === selectedIndex ? 7: 5},
                                    
                                    ]}></View>
                                  )
                              })
                          }    
                            
                      </View>
                </View>
            
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        width:"100%",
        height:"100%",
      
    },
    one:{
        width:"100%",
        height:200,
      //  backgroundColor:"#0A79DF"
    },
    cercalView:{

    },
    imageVies:{
        width:"100%",
        height:"100%",
      // backgroundColor:"green"

    },

    scroolview:{
        height:deviceWidth,
        height:"27.5%"
    },
    middle:{
        height:deviceWidth,
        height:"27.5%"

    },
    circleView:{
        width:"100%",
        height:"100%",
        marginTop:30,
      //  backgroundColor:"red",
        opacity:0.8,
       // zIndex:12,
        position: 'absolute',
        bottom:0,
       // left:1,
       // marginHorizontal:10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },
    dot:{
      //  position:"absolute",
       
       
        
        margin:2,
        //opacity:1
        //padding:3,
        
    }
})