import { Deck, Slide, Heading, CodePane, Progress, FlexBox, Text, Appear, UnorderedList, ListItem, Table, TableHeader, TableRow, TableCell, TableBody } from 'spectacle';
import { flexBoxStyle } from './constants/layoutConstants';
import { theme } from './constants/styleConstants';
import './App.css';

function App() {
    return (
        <Deck theme={theme}>
            <Slide backgroundColor="primary" slideNum="1">
                <FlexBox {...flexBoxStyle}>
                    <Heading fontSize="header" color="secondary">Roku Certification Criteria</Heading>
                </FlexBox>
            </Slide>
            <Slide backgroundColor="primary" slideNum="2">
                <Heading fontSize="header" color="secondary">Channel publishing</Heading>
                <Appear>
                    <Heading color="secondary">Public Channel</Heading>
                </Appear>
                <Appear>
                    <Heading elementNum="2" color="secondary">Non-Certified Channel</Heading>
                </Appear>
            </Slide>
            <Slide backgroundColor="primary" slideNum="3">
                <Heading color="secondary">Public Channel</Heading>
                <Text color="secondary">Published in the Channel Store and discoverable from the Search feature on the Roku home page.</Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="4">
                <Heading color="secondary">Non-Certified Channel</Heading>
                <Text color="secondary">Not in the Channel Store and used for testing or limited circulation. It can only be installed using the channel’s dedicated access code.</Text>
            </Slide>
            <Slide backgroundColor="primary" slideNum="5">
                <Heading color="secondary">Certification criteria (why!?)</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">To ensure the overall quality of the Roku platform</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Consistency between Roku apps</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Ensure that new channels and channel updates to the Channel Store properly integrate applicable platform requirements.</ListItem></Appear>
                    <Appear><ListItem elementNum="4" color="secondary">Annoy Devs!!!!</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="6">
                <Heading>Certification criteria are listed by functionality:</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Advertising</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Purchases</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Performance</ListItem></Appear>
                    <Appear><ListItem elementNum="4" color="secondary">Channel operation</ListItem></Appear>
                    <Appear><ListItem elementNum="5" color="secondary">Deep linking</ListItem></Appear>
                    <Appear><ListItem elementNum="6" color="secondary">UI and Graphics</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="7">
                <Heading color="secondary">Advertising</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Must include Roku Advertising Framework (RAF)</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Partners must disclose integration/use of all non-Roku SDKs, libraries, or other software systems.</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Channel must pass Roku's ID for Advertisers (RIDA) and "limit ad tracking" (LAT) value on ad server requests</ListItem></Appear>
                    <Appear><ListItem elementNum="4" color="secondary">The channel ignores FF/REW commands received during an ad break</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="8">
                <Heading color="secondary">RAF</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[1, [4, 5], [10, 13], [15, 20], 22, [26, 28], [45, 54], 49, [50, 54], 55, [60, 70], [62, 65]]}
                >
                    {`  
                        Library "Roku_Ads.brs"

                        sub init()
                            m.top.functionName = "playContentWithAds" 
                            m.top.id = "PlayerTask"
                        end sub

                        sub playContentWithAds()
   
                            video = m.top.video
                            view = video.getParent() ' is the node under which RAF should display its UI (passed as 3rd argument of showAds())

                            RAF = Roku_Ads()

                            content = video.content

                            RAF.setAdUrl(content.ad_url)
                            RAF.enableAdMeasurements(true)
                            RAF.setContentGenre(content.categories)  'if unset, ContentNode has it as []
                            RAF.setContentLength(content.length)

                            adPods = RAF.getAds() ' set the stream adpods
                            keepPlaying = true 

                            ' show the pre-roll ads, if any
                            if adPods <> invalid and adPods.count() > 0
                                keepPlaying = RAF.showAds(adPods, invalid, view) ' if it returns false, playback should be canceled
                            end if

                            port = CreateObject("roMessagePort")
                            if keepPlaying ' playback cancel if false
                                video.observeField("position", port)
                                video.observeField("state", port)
                                video.visible = true
                                video.control = "play"
                                video.setFocus(true)
                            end if

                            curPos = 0
                            adPods = invalid
                            isPlayingPostroll = false
                            while keepPlaying
                                msg = wait(0, port)
                                if type(msg) = "roSGNodeEvent"
                                    if msg.GetField() = "position" then
                                        ' keep track of where we reached in content
                                        curPos = msg.GetData() 
                                        ' check for mid-roll ads
                                        adPods = RAF.getAds(msg)
                                        if adPods <> invalid and adPods.count() > 0
                                            print "PlayerTask: mid-roll ads, stopping video"
                                            'ask the video to stop - the rest is handled in the state=stopped event below
                                            video.control = "stop"  
                                        end if
                                    else if msg.GetField() = "state"
                                        curState = msg.GetData()
                                        if curState = "stopped" then
                                            ...
                                            ...
                                        else if curState = "finished"
                                            ' render post-roll ads
                                            adPods = RAF.getAds(msg)
                                            if adPods = invalid or adPods.count() = 0 then 
                                                exit while
                                            end if

                                            isPlayingPostroll = true
                                            
                                            ' stop the video, the post-roll would show when the state changes to  "stopped" (above)
                                            video.control = "stop"
                                        end if
                                    end if
                                end if
                            end while
                        end sub
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="9">
                <Heading color="secondary">Purchases</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Channels with transactional content (SVOD, TVOD, and other subscription services) must use an on-device Roku Pay billing flow</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Content or subscriptions through Roku Pay must be automatically entitled across all devices tied to the purchasing Roku account.</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Subscription services must create product groups in the Developer Dashboard</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="10">
                <Heading color="secondary">roChannelStore</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[5, [11, 14], [16, 21], [23, 27]]}
                >
                    {`  
                        sub init()
                            ...
                            ...

                            m.channelStore = CreateObject("roChannelStore")
                        sub

                        ...
                        ...

                        sub loadCatalog()
                            m.channelStore.observeField("catalog", "onCatalog")
                            m.channelStore.command = "getCatalog"
                        end sub

                        sub onCatalog()
                            catalog = m.channelStore.catalog
                            ' build ui from catalog
                            ...
                            ...
                        end sub

                        sub doOrder(orderData as Object)
                            m.channelStore.observeField("orderStatus", "onOrderStatus")
                            m.channelStore.order = orderData
                            m.channelStore.command = "doOrder"
                        end sub
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="11">
                <Heading color="secondary">Performance</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">The channel must be available on all Roku platforms that receive the current firmware.</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">The channel launches to a fully rendered homescreen within 15 seconds on the Roku Streaming Stick+ (Amarillo-2019 3810X) or 20 seconds on the Roku Express (Littlefield 37XXX)</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">You must add a signal beacon to your application to measure launch times.</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="12">
                <UnorderedList>
                    <ListItem color="secondary">Screen-to-screen (scene-to-scene) transitions are within 3 seconds on the Roku Streaming Stick+ (Amarillo-2019 3810X) or 5 seconds on the Roku Express (Littlefield 37XXX)</ListItem>
                    <Appear><ListItem elementNum="1" color="secondary">Responses to user requests that take longer than 3 seconds require the appropriate "in progress" notification. Responses cannot take longer than 10 seconds to complete.</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Content starts playing within 8 seconds of initiation on the Roku Streaming Stick+ (Amarillo-2019 3810X) or 10 seconds on the Roku Express (Littlefield 37XXX).</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Channel file size is 4 MB or less.</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="13">
                <Heading color="secondary">Signal Beacons</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[11, [15, 16]]}
                >
                    {`  
                        ' home page 
                        sub init()
                            ...
                            ...
                            renderPageContent()
                        end sub

                        sub renderPageContent()
                            ...
                            ...
                            m.top.scene.signalBeacon(“AppLaunchComplete”)
                        end sub

                        ...
                            scene.signalBeacon(“AppDialogInitiate”)
                            scene.signalBeacon(“AppDialogComplete”)
                        ...
                        ...
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="14">
                <Heading color="secondary">Channel operation</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Channel updates do not break saved data or require re-activation/re-linking/re-login.</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">The video node must be in focus during full screen video playback when there are no active UI components over the video.</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">The channel may not prevent Roku's system screensaver from activating over UI</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="15">
                <UnorderedList>
                    <ListItem elementNum="1" color="secondary">The back button directly returns the user to the previous screen and/or state</ListItem>
                    <Appear><ListItem elementNum="2" color="secondary">Thumbnails must be displayed during trick play for VOD content longer than 15 minutes.</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">VOD content longer that 15 minutes must include video bookmark functionality</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="16">
                <Heading color="secondary">Deep linking</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Channels support deep linking for all media types (including "series"), per Roku's deep linking policy.</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">When the channel is already running, direct playback commands will deep link to content</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">The channel does not deep link into other channels, or direct users to exit the channel to purchase content, goods or other services.</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="17">
                <Heading color="secondary">Deep linking policy</Heading>
                <Table color="secondary">
                    <TableHeader border="2px solid #662d91" textAlign="center" bg="secondary" color="primary">
                        <TableRow border="2px solid #662d91">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="primary">mediaType in Deep Link</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="primary">Description</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody border="2px solid #662d91" color="secondary">
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">movie</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Movie or long-form film (over 15 minutes).</TableCell>
                        </TableRow>
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">episode</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Single content item (an episode of a TV show, for example).</TableCell>
                        </TableRow>
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">season</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Description</TableCell>
                        </TableRow>
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">series</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Set of related serialized episodes and possibly seasons.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Slide>
            <Slide backgroundColor="primary" slideNum="17">
                <Table color="secondary">
                    <TableHeader border="2px solid #662d91" textAlign="center" bg="secondary" color="primary">
                        <TableRow border="2px solid #662d91">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="primary">mediaType in Deep Link</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="primary">Description</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody border="2px solid #662d91" color="secondary">
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">shortFormVideo</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Standalone content that is 15 minutes or less that is not a movie or TV show (for example, movie trailers, news clips, comedy clips, food reviews, or other clips).</TableCell>
                        </TableRow>
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">special</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">One-time TV programs that are not part of a series, or content that does not fit into any other mediaType category (for example, music, artists, sporting events, non-episodic news specials).</TableCell>
                        </TableRow>
                        <TableRow border="2px solid #662d91" color="secondary">
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">live</TableCell>
                            <TableCell paddingLeft="15px" border="2px solid #662d91" color="secondary">Live linear stream.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Slide>
            <Slide backgroundColor="primary" slideNum="18">
                <Heading color="secondary">Handling Deeplinking</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[2, [7, 8]]}
                >
                    {`  
                        'Roku app Entry point (main.brs)
                        sub main(args as dynamic)
                            m.port = CreateObject("roMessagePort")
                            screen = CreateObject("roSGScreen")
                            screen.setMessagePort(m.port)
                        
                            scene = screen.CreateScene("BaseScene")
                            scene.launchArgs = args

                            screen.show()
                        
                            while(true) ' Normal infinite loop
                                ...
                                ...
                            end while
                        end sub
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="18">
                <Heading color="secondary">Handling Deeplinking</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[5, [8, 26], 9, 10, [11, 15], [16, 21], [22, 25]]}
                >
                    {`  
                        ' scene script (e.g. BaseScene.brs)
                        sub init()
                            ...
                            ...
                            m.top.observeField("launchArgs", "handleDeeplink")
                        end sub

                        sub handleDeeplink(event as object)
                            args = event.getData
                            if (args.mediaType = "movie" or args.mediaType = "episode" or args.mediaType = "short-form" or args.mediaType = "series" or args.mediaType = "special")
                                if validate(args.contentId)
                                    'play content directly, starting at last bookmarked position
                                else
                                    'pop an error message and launch channel home page.
                                end if
                            else if (args.mediaType = “season”)
                                if validate(args.contentId)
                                    'display an episodic picker screen with the episode of the contentId selected
                                else
                                    'pop an error message and launch channel home page.
                                end if
                            else
                                'deep linking issue such as contentId not matching any content in the partner's catalog
                                'display an appropriate error message for the user and launch home page.
                            end if
                        end sub
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="18">
                <Heading color="secondary">Handling Input Deeplinking</Heading>
                <CodePane
                    language="basic"
                    theme={theme.codeTheme.brs}
                    highlightRanges={[[12, 21], [15, 19], 18]}
                >
                    {`  
                        'Roku app Entry point (main.brs)
                        sub main(args as dynamic)
                            ...
                            ...
                        
                            while(true)
                                msg = wait(0, m.port)
                                msgType = type(msg)
                                if msgType = "roSGScreenEvent"
                                    if msg.isScreenClosed() then return
                                end if
                                if type(msg) = "roInputEvent"
                                    if msg.IsInput()
                                        info = msg.GetInfo()
                                        if info.DoesExist("mediatype") and info.DoesExist("contentid")
                                            mediaType = info.mediatype
                                            contentId = info.contentid
                                            scene.deeplinkParams = {mediaType: mediaType, contentId: contentId}
                                        end if
                                    end if
                                end if
                            end while
                        end sub
                    `}
                </CodePane>
            </Slide>
            <Slide backgroundColor="primary" slideNum="19">
                <Heading color="secondary">UI and Graphics</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">All submitted channels must have a non-zero version number. </ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Channels in the Kids & Family category only include content that is appropriate for children</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">The Channel Store artwork and splash screen clearly represent the name/identity of the channel using only broadcast-safe colors and are properly sized.</ListItem></Appear>
                </UnorderedList>
            </Slide>
            <Slide backgroundColor="primary" slideNum="20">
                <Heading color="secondary">Testing channels before submission</Heading>
                <UnorderedList>
                    <Appear><ListItem elementNum="1" color="secondary">Static Analysis tool</ListItem></Appear>
                    <Appear><ListItem elementNum="2" color="secondary">Certification Testing tool</ListItem></Appear>
                    <Appear><ListItem elementNum="3" color="secondary">Test automation software</ListItem></Appear>
                    <Appear><ListItem elementNum="4" color="secondary">Testing with unpublished channels</ListItem></Appear>
                </UnorderedList>
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
