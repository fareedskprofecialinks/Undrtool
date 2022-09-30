import React, { useEffect } from 'react';
import ReactSpeedometer from "react-d3-speedometer";

const ReactSpeedometerComponent = (props) => {

    return (<ReactSpeedometer
        fluidWidth={true}
        forceRender={true}
        minValue={props.minValue}
        maxValue={props.maxValue}
        value={props.value}
        // value={5}
        customSegmentStops={props.customSegmentStops}
        customSegmentLabels={[
            {
                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLow : 'Very Low',
                text: 'Very Low',
                position: "INSIDE",
                color: "#002a4a",
                fontSize: "16px"
            },
            {
                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).low : 'Low',
                text: 'Low',
                position: "INSIDE",
                color: "#002a4a",
                fontSize: "16px"
            },
            {
                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).medium : 'Medium',
                text: 'Medium',
                position: "INSIDE",
                color: "#002a4a",
                fontSize: "16px"
            },
            {
                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).high : 'High',
                text: 'High',
                position: "INSIDE",
                color: "#002a4a",
                fontSize: "16px"
            },
            {
                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHigh : 'Very High',
                text: 'Very High',
                position: "INSIDE",
                color: "#002a4a",
                fontSize: "16px"
            },
        ]}
        width={300}
        height={300}
        segmentColors={[
            "#76F013",
            "#38761D",
            "#FF9900",
            "#E06666",
            "#FF0000",
        ]}
        // currentValueText="Current Value: #{value}"
        // currentValueText={i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.score + " : ${value}"}
        currentValueText={props.currentValueText}
        needleColor="#002a4a"
        needleTransitionDuration={4000}
        needleTransition="easeElastic"
        textColor={'black'}
    />
    )
}

export default ReactSpeedometerComponent;