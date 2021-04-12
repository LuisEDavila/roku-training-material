import { Deck, Slide, Heading, CodePane, Progress, FlexBox } from 'spectacle';
import { flexBoxStyle } from './constants/layoutConstants';
import { theme } from './constants/styleConstants';
import './App.css';

function App() {
    console.log(flexBoxStyle)
    return (
        <Deck theme={theme}>
            <Slide backgroundColor="primary" slideNum="1">
                <FlexBox {...flexBoxStyle}>
                    <Heading fontSize="header" color="secondary">Roku Certification Criteria</Heading>
                </FlexBox>
            </Slide>
            <Slide backgroundColor="primary" slideNum="2">
                <Heading>Brightscript Snippet</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                >
                    {`  
                        function onKeyEvent(key as String, press as Boolean) as Boolean
                            if press
                                if key = "fastforward" OR key = "right"
                                    m.video.seek = m.video.position + m.SEEK_STEP_IN_SEC
                                else if key = "rewind" OR key = "left"
                                    m.video.seek = m.video.position - m.SEEK_STEP_IN_SEC
                                else if key = "play"
                                    if m.video.state = "paused"
                                        m.video.control = "resume"
                                    else
                                        m.video.control = "pause"
                                    end if
                                end if
                            end if
                            return true
                        end function
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="secondary" slideNum="3">
                <Heading color="primary">SceneGraph Component</Heading>
                <CodePane
                    language="xml"
                    theme={theme.codeTheme.xml}
                >
                    {`  
                        <component name="ExtendedVideo" extends="Video" >
                            <script type="text/brightscript" uri = "ExtendedVideo.brs"/>
                            <children>
                                <Group id="progress" translation="[200,900]">
                                    <Rectangle id="outlineRect" width="1520" height="40" color="0xFFFFFFFF" opacity="0.4"/>
                                    <Rectangle id="progressRect" width="1" height="40"/>
                                    <Label id="leftProgressLabel" text="00:00" translation="[-140,5]"/>
                                    <Label id="rightProgressLabel" text="00:00" translation="[1540,5]"/>
                                    <Poster 
                                        id="progressModeBackground" 
                                        translation="[690, -80]" 
                                        width="92" 
                                        height="60"
                                        uri="pkg:/images/TrickPlay_ButtonBackground_HD.png" 
                                        opacity="0.8" >
                                        <Poster id="progressMode" translation="[15,12]" width="60" height="36" opacity="1.0"/>
                                    </Poster>
                                </Group>
                                <Group id="loading" translation="[760,720]">
                                    <Rectangle id="loadOutlineRect" width="400" height="20" color="0xFFFFFFFF" opacity="0.1"/>
                                    <Rectangle id="loadProgressRect" width="1" height="20"/>
                                    <Label id="loadLabel" text="Loading..." translation="[100,-60]"/>
                                </Group>
                            </children>
                        </component>
                    `}
                </CodePane>
            </Slide>
        </Deck>
    );
}

export default App;
