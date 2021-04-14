import { Deck, Slide, Heading, FlexBox, Appear, UnorderedList, ListItem, Image, Text, CodePane } from 'spectacle';
import { flexBoxStyle } from './constants/layoutConstants';
import { theme } from './constants/styleConstants';
import './App.css';

function App() {
    return (
        <Deck theme={theme}>
            <Slide backgroundColor="primary" slideNum="1">
                <FlexBox {...flexBoxStyle}>
                    <Heading fontSize="header" color="secondary">Roku Developer Tools</Heading>
                </FlexBox>
            </Slide>
            <Slide backgroundColor="primary" slideNum="2">
                <Heading fontSize="header" color="secondary">Developer Tools</Heading>
                <Appear>
                    <Heading color="secondary">Developed by Roku</Heading>
                </Appear>
                <Appear>
                    <Heading elementNum="2" color="secondary">Developed by Roku Community</Heading>
                </Appear>
            </Slide>
            <Slide backgroundColor="primary" slideNum="3">
                <Heading color="secondary">Developed by Roku</Heading>
                <FlexBox width="100%" alignItems="flex-start">
                    <UnorderedList>
                        <Appear><ListItem elementNum="1" color="secondary">Remote Tool</ListItem></Appear>
                        <Appear><ListItem elementNum="2" color="secondary">RALE</ListItem></Appear>
                        <Appear><ListItem elementNum="3" color="secondary">Deep Linking Tester</ListItem></Appear>
                        <Appear><ListItem elementNum="4" color="secondary">Brightscript Profiler</ListItem></Appear>
                        <Appear><ListItem elementNum="5" color="secondary">Static Channel Analysis</ListItem></Appear>
                    </UnorderedList>
                    <UnorderedList>
                        <Appear><ListItem elementNum="6" color="secondary">Unit Test Framework</ListItem></Appear>
                        <Appear><ListItem elementNum="7" color="secondary">SGDEX</ListItem></Appear>
                        <Appear><ListItem elementNum="8" color="secondary">Roku Chnnel Automation</ListItem></Appear>
                        <Appear><ListItem elementNum="9" color="secondary">Stream Tester</ListItem></Appear>
                    </UnorderedList>
                </FlexBox>
            </Slide>
            <Slide backgroundColor="primary" slideNum="4">
                <FlexBox>
                    <Image width="100px" src="./images/ic_remote.png" />
                    <Heading color="secondary">Remote Tool</Heading>
                </FlexBox>
                <Text color="secondary">
                    Let you navigate your Roku and channel, send a text to keyboard screens, and much more with the Roku Remote Tool. You can even write your own scripts, run them on a device as well as export or import them later for simple automation needs.
                </Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="5">
                <FlexBox>
                    <Image width="100px" src="./images/ic_remote.png" />
                    <Heading color="secondary">Remote Tool</Heading>
                </FlexBox>
                <iframe title="Roku Remote Tool" src="http://devtools.web.roku.com/RokuRemote/">
                </iframe>
            </Slide>
            <Slide backgroundColor="primary" slideNum="6">
                <FlexBox>
                    <Image width="100px" src="./images/ic_advanced_layout_editor.png" />
                    <Heading color="secondary">RALE</Heading>
                </FlexBox>
                <Text color="secondary">
                    The Roku Advanced Layout Editor, aka RALE, is a tool that provides a hierarchical view of the node tree in a Roku Scene Graph channel. It also lets developers or designers dynamically lay out the visual aspects of a channel for quick prototyping and design purposes. Changes are made in the RALE UI and reflected immediately on the channel under test on the target Roku device.
                </Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="7">
                <FlexBox>
                    <Image width="100px" src="./images/ic_deep_link_testing.png" />
                    <Heading color="secondary">Deeplink Tester</Heading>
                </FlexBox>
                <Text color="secondary">
                    This web utility and companion channel make it very easy to send deep linking commands to your channel and to build deep linking test suites that can be shared with developers and QA.
                </Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="8">
                <FlexBox>
                    <Image width="100px" src="./images/ic_deep_link_testing.png" />
                    <Heading color="secondary">Deeplink Tester</Heading>
                </FlexBox>
                <iframe title="Roku Deeplink Tester" src="http://devtools.web.roku.com/DeepLinkingTester/">
                </iframe>
            </Slide>
            <Slide backgroundColor="primary" slideNum="9">
                <FlexBox>
                    <Image width="100px" src="./images/ic_brightscript_profiler.png" />
                    <Heading color="secondary">Brightscript Profiler</Heading>
                </FlexBox>
                <Text color="secondary">
                    The BrightScript Profiler gathers important metrics such as CPU usage, "wall-clock" time, etc. In addition to that it gives you memory profiling and leak detection.
                </Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="10">
                <FlexBox>
                    <Image width="100px" src="./images/ic_brightscript_profiler.png" />
                    <Heading color="secondary">Brightscript Profiler</Heading>
                </FlexBox>
                <iframe title="Roku Brightscript Profiler" src="http://devtools.web.roku.com/profiler/viewer/">
                </iframe>
            </Slide>
            <Slide backgroundColor="primary" slideNum="11">
                <FlexBox>
                    <Image width="100px" src="./images/ic_static_channel_analysis.png" />
                    <Heading color="secondary">Static Channel Analysis</Heading>
                </FlexBox>
                <Text color="secondary">
                    Static channel analysis provides a mechanism for testing third-party channels submitted through the developer portal for common issues in the channel package and source code.
                </Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="12">
                <FlexBox>
                    <Image width="100px" src="./images/ic_static_channel_analysis.png" />
                    <Heading color="secondary">Static Channel Analysis</Heading>
                </FlexBox>
                <FlexBox>
                    <Image width="80%" src="./images/static_analysis_example.png" />
                </FlexBox>
            </Slide>
            <Slide backgroundColor="primary" slideNum="13">
                <FlexBox>
                    <Image width="100px" src="./images/ic_static_channel_analysis.png" />
                    <Heading color="secondary">Static Channel Analysis</Heading>
                </FlexBox>
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
            <Slide backgroundColor="primary" slideNum="21">
                <FlexBox {...flexBoxStyle}>
                    <Heading fontSize="header" color="secondary">Fin.</Heading>
                </FlexBox>
            </Slide>
        </Deck>
    );
}

export default App;
