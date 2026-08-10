// src/data/officialReadingPassages.js
// Transcribed verbatim from "IELTS Academic Reading Sample Tasks" (2023),
// jointly published by British Council, IDP IELTS, and Cambridge University
// Press & Assessment — source: ielts.org official sample materials.
// These are REAL passages, REAL questions, REAL answer keys. Nothing here
// is AI-generated. Used by permission structure of publicly released
// official sample material for candidate practice.

export const OFFICIAL_PASSAGES = [
  {
    id: 'matching-features',
    title: 'The Development of Rockets',
    questionType: 'Matching Features',
    source: 'IELTS.org Official Sample Task',
    note: "Extract from a passage on the development of rockets. The preceding text explored the slow development of the rocket and explained the principle of propulsion.",
    passage: `The invention of rockets is linked inextricably with the invention of 'black powder'. Most historians of technology credit the Chinese with its discovery. They base their belief on studies of Chinese writings or on the notebooks of early Europeans who settled in or made long visits to China to study its history and civilisation. It is probable that, some time in the tenth century, black powder was first compounded from its basic ingredients of saltpetre, charcoal and sulphur. But this does not mean that it was immediately used to propel rockets. By the thirteenth century, powder-propelled fire arrows had become rather common. The Chinese relied on this type of technological development to produce incendiary projectiles of many sorts, explosive grenades and possibly cannons to repel their enemies. One such weapon was the 'basket of fire' or, as directly translated from Chinese, the 'arrows like flying leopards'. The 0.7 metre-long arrows, each with a long tube of gunpowder attached near the point of each arrow, could be fired from a long, octagonal-shaped basket at the same time and had a range of 400 paces. Another weapon was the 'arrow as a flying sabre', which could be fired from crossbows. The rocket, placed in a similar position to other rocket-propelled arrows, was designed to increase the range. A small iron weight was attached to the 1.5m bamboo shaft, just below the feathers, to increase the arrow's stability by moving the centre of gravity to a position below the rocket. At a similar time, the Arabs had developed the 'egg which moves and burns'. This 'egg' was apparently full of gunpowder and stabilised by a 1.5m tail. It was fired using two rockets attached to either side of this tail.

It was not until the eighteenth century that Europe became seriously interested in the possibilities of using the rocket itself as a weapon of war and not just to propel other weapons. Prior to this, rockets were used only in pyrotechnic displays. The incentive for the more aggressive use of rockets came not from within the European continent but from far-away India, whose leaders had built up a corps of rocketeers and used rockets successfully against the British in the late eighteenth century. The Indian rockets used against the British were described by a British Captain serving in India as 'an iron envelope about 200 millimetres long and 40 millimetres in diameter with sharp points at the top and a 3m-long bamboo guiding stick'. In the early nineteenth century the British began to experiment with incendiary barrage rockets. The British rocket differed from the Indian version in that it was completely encased in a stout, iron cylinder, terminating in a conical head, measuring one metre in diameter and having a stick almost five metres long and constructed in such a way that it could be firmly attached to the body of the rocket. The Americans developed a rocket, complete with its own launcher, to use against the Mexicans in the mid-nineteenth century. A long cylindrical tube was propped up by two sticks and fastened to the top of the launcher, thereby allowing the rockets to be inserted and lit from the other end. However, the results were sometimes not that impressive as the behaviour of the rockets in flight was less than predictable.`,
    instructions: "Questions 7-10: Look at the following items and the list of groups below. Match each item with the group which first invented or used them. Write the correct letter A-E. NB: You may use any letter more than once.\n\nFirst invented or used by: A the Chinese / B the Indians / C the British / D the Arabs / E the Americans",
    questions: [
      { number: 7, question: 'black powder', answer: 'A' },
      { number: 8, question: 'rocket-propelled arrows for fighting', answer: 'A' },
      { number: 9, question: 'rockets as war weapons', answer: 'B' },
      { number: 10, question: 'the rocket launcher', answer: 'E' },
    ],
  },
  {
    id: 'table-completion',
    title: 'Dung Beetles',
    questionType: 'Table Completion',
    source: 'IELTS.org Official Sample Task',
    note: "Extract from a passage on dung beetles. The preceding text gave background facts about dung beetles and described a decision to introduce non-native varieties to Australia.",
    passage: `Introducing dung beetles into a pasture is a simple process: approximately 1,500 beetles are released, a handful at a time, into fresh cow pats in the cow pasture. The beetles immediately disappear beneath the pats digging and tunnelling and, if they successfully adapt to their new environment, soon become a permanent, self-sustaining part of the local ecology. In time they multiply and within three or four years the benefits to the pasture are obvious.

Dung beetles work from the inside of the pat so they are sheltered from predators such as birds and foxes. Most species burrow into the soil and bury dung in tunnels directly underneath the pats, which are hollowed out from within. Some large species originating from France excavate tunnels to a depth of approximately 30 cm below the dung pat.

These beetles make sausage-shaped brood chambers along the tunnels. The shallowest tunnels belong to a much smaller Spanish species that buries dung in chambers that hang like fruit from the branches of a pear tree. South African beetles dig narrow tunnels of approximately 20 cm below the surface of the pat. Some surface-dwelling beetles, including a South African species, cut perfectly-shaped balls from the pat, which are rolled away and attached to the bases of plants.

For maximum dung burial in spring, summer and autumn, farmers require a variety of species with overlapping periods of activity. In the cooler environments of the state of Victoria, the large French species (2.5 cms long), is matched with smaller (half this size), temperate-climate Spanish species. The former are slow to recover from the winter cold and produce only one or two generations of offspring from late spring until autumn. The latter, which multiply rapidly in early spring, produce two to five generations annually. The South African ball-rolling species, being a sub-tropical beetle, prefers the climate of northern and coastal New South Wales where it commonly works with the South African tunneling species. In warmer climates, many species are active for longer periods of the year.

Glossary: dung = the droppings or excreta of animals; cow pats = droppings of cows`,
    instructions: "Questions 9-13: Complete the table below. Choose NO MORE THAN THREE WORDS from the passage for each answer.\n\nTable columns: Species | Size | Preferred climate | Complementary species | Start of active period | Number of generations per year\nFrench: 2.5cm | cool | Spanish | late spring | 1-2\nSpanish: 1.25cm | [9] | [10 for start] | [11 generations]\nSouth African ball roller: [12 climate] | [13 complementary species]",
    questions: [
      { number: 9, question: "Spanish species' preferred climate", answer: 'temperate' },
      { number: 10, question: "Spanish species' start of active period", answer: 'early spring' },
      { number: 11, question: "Spanish species' number of generations per year", answer: 'two to five' },
      { number: 12, question: "South African ball roller's preferred climate", answer: 'sub-tropical' },
      { number: 13, question: "South African ball roller's complementary species", answer: 'South African tunneling' },
    ],
  },
  {
    id: 'flowchart-completion',
    title: 'The Serious Search for an Anti-Aging Pill',
    questionType: 'Flow-chart Completion',
    source: 'IELTS.org Official Sample Task (adapted from Scientific American)',
    note: "Extract from a Part 3 text about the effect of a low-calorie diet on the aging process.",
    passage: `No treatment on the market today has been proved to slow human aging. But one intervention, consumption of a low-calorie yet nutritionally balanced diet, works incredibly well in a broad range of animals, increasing longevity and prolonging good health. Those findings suggest that caloric restriction could delay aging and increase longevity in humans, too. But what if someone could create a pill that mimicked the physiological effects of eating less without actually forcing people to eat less, a 'caloric-restriction mimetic'?

The best-studied candidate for a caloric-restriction mimetic, 2DG (2-deoxy-D-glucose), works by interfering with the way cells process glucose. It has proved toxic at some doses in animals and so cannot be used in humans. But it has demonstrated that chemicals can replicate the effects of caloric restriction; the trick is finding the right one.

Cells use the glucose from food to generate ATP (adenosine triphosphate), the molecule that powers many activities in the body. By limiting food intake, caloric restriction minimizes the amount of glucose entering cells and decreases ATP generation. When 2DG is administered to animals that eat normally, glucose reaches cells in abundance but the drug prevents most of it from being processed and thus reduces ATP synthesis. Researchers have proposed several explanations for why interruption of glucose processing and ATP production might retard aging. One possibility relates to the ATP-making machinery's emission of free radicals, which are thought to contribute to aging and to such age-related diseases as cancer by damaging cells. Reduced operation of the machinery should limit their production and thereby constrain the damage. Another hypothesis suggests that decreased processing of glucose could indicate to cells that food is scarce (even if it isn't) and induce them to shift into an anti-aging mode that emphasizes preservation of the organism over such 'luxuries' as growth and reproduction.`,
    instructions: "Questions 1-3: Complete the flow-chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer.\n\nHow a caloric-restriction mimetic works:\nCR mimetic → less [1] is processed → production of ATP is decreased →\nTheory 1: cells less damaged by disease because fewer [2] are emitted\nTheory 2: cells focus on [3] because food is in short supply",
    questions: [
      { number: 1, question: 'What is processed less by a CR mimetic?', answer: 'glucose' },
      { number: 2, question: 'What is emitted less, protecting cells from disease?', answer: 'free radicals' },
      { number: 3, question: 'What do cells focus on when food seems scarce?', answer: 'preservation' },
    ],
  },
  {
    id: 'true-false-not-given',
    title: 'The Life and Work of Marie Curie (Part 1)',
    questionType: 'True/False/Not Given',
    source: 'IELTS.org Official Sample Task (adapted from Encyclopaedia Britannica)',
    note: "Extract from a Part 1 text about the scientist Marie Curie.",
    passage: `Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity, and was twice a winner of the Nobel Prize. With her husband, Pierre Curie, and Henri Becquerel, she was awarded the 1903 Nobel Prize for Physics, and was then sole winner of the 1911 Nobel Prize for Chemistry. She was the first woman to win a Nobel Prize.

From childhood, Marie was remarkable for her prodigious memory, and at the age of 16 won a gold medal on completion of her secondary education. Because her father lost his savings through bad investment, she then had to take work as a teacher. From her earnings she was able to finance her sister Bronia's medical studies in Paris, on the understanding that Bronia would, in turn, later help her to get an education.

In 1891 this promise was fulfilled and Marie went to Paris and began to study at the Sorbonne (the University of Paris). She often worked far into the night and lived on little more than bread and butter and tea. She came first in the examination in the physical sciences in 1893, and in 1894 was placed second in the examination in mathematical sciences. It was not until the spring of that year that she was introduced to Pierre Curie.`,
    instructions: "Questions 1-3: Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees, FALSE if it contradicts, NOT GIVEN if there is no information on this.",
    questions: [
      { number: 1, question: "Marie Curie's husband was a joint winner of both Marie's Nobel Prizes.", answer: 'FALSE' },
      { number: 2, question: 'Marie became interested in science when she was a child.', answer: 'NOT GIVEN' },
      { number: 3, question: "Marie was able to attend the Sorbonne because of her sister's financial contribution.", answer: 'TRUE' },
    ],
  },
  {
    id: 'matching-headings',
    title: 'The Physics of Traffic Behavior',
    questionType: 'Matching Headings',
    source: 'IELTS.org Official Sample Task (© The Atlantic Media Co.)',
    note: "Extract from a Part 2 text about the physics of traffic behaviour.",
    passage: `A. Some years ago, when several theoretical physicists, principally Dirk Helbing and Boris Kerner of Stuttgart, Germany, began publishing papers on traffic flow in publications normally read by traffic engineers, they were clearly working outside their usual sphere of investigation. They had noticed that if they simulated the movement of vehicles on a highway, using the equations that describe how the molecules of a gas move, some very strange results emerged. Of course, vehicles do not behave exactly like gas molecules: for example, drivers try to avoid collisions by slowing down when they get too near another vehicle, whereas gas molecules have no such concern. However, the physicists modified the equations to take the differences into account and the overall description of traffic as a flowing gas has proved to be a very good one; the moving-gas model of traffic reproduces many phenomena seen in real-world traffic.

The strangest thing that came out of these equations, however, was the implication that congestion can arise completely spontaneously; no external causes are necessary. Vehicles can be flowing freely along, at a density still well below what the road can handle, and then suddenly gel into a slow-moving ooze. Under the right conditions a brief and local fluctuation in the speed or the distance between vehicles is all it takes to trigger a system-wide breakdown that persists for hours. In fact, the physicists' analysis suggested such spontaneous breakdowns in traffic flow probably occur quite frequently on highways.

B. Though a decidedly unsettling discovery, this showed striking similarities to the phenomena popularized as 'chaos theory'. This theory has arisen from the understanding that in any complex interacting system which is made of many parts, each part affects the others. Consequently, tiny variations in one part of a complex system can grow in huge but unpredictable ways. This type of dramatic change from one state to another is similar to what happens when a chemical substance changes from a vapor to a liquid. It often happens that water in a cloud remains as a gas even after its temperature and density have reached the point where it could condense into water droplets. However, if the vapor encounters a solid surface, even something as small as a speck of dust, condensation can take place and the transition from vapor to liquid finally occurs. Helbing and Kerner see traffic as a complex interacting system. They found that a small fluctuation in traffic density can act as the 'speck of dust' causing a sudden change from freely moving traffic to synchronized traffic, when vehicles in all lanes abruptly slow down and start moving at the same speed, making passing impossible.

C. The physicists have challenged proposals to set a maximum capacity for vehicles on highways. They argue that it may not be enough simply to limit the rate at which vehicles are allowed to enter a highway, rather, it may be necessary to time each vehicle's entry onto a highway precisely to coincide with a temporary drop in the density of vehicles along the road. The aim of doing this would be to smooth out any possible fluctuations in the road conditions that can trigger a change in traffic behavior and result in congestion. They further suggest that preventing breakdowns in the flow of traffic could ultimately require implementing the radical idea that has been suggested from time to time: directly regulating the speed and spacing of individual cars along a highway with central computers and sensors that communicate with each car's engine and brake controls.

D. However, research into traffic control is generally centered in civil engineering departments and here the theories of the physicists have been greeted with some skepticism. Civil engineers favor a practical approach to problems and believe traffic congestion is the result of poor road construction (two lanes becoming one lane or dangerous curves), which constricts the flow of traffic. Engineers questioned how well the physicists' theoretical results relate to traffic in the real world. Indeed, some engineering researchers questioned whether elaborate chaos-theory interpretations are needed at all, since at least some of the traffic phenomena the physicists' theories predicted seemed to be similar to observations that had been appearing in traffic engineering literature under other names for years; observations which had straightforward cause-and-effect explanations.

E. James Banks, a professor of civil and environmental engineering at San Diego State University in the US, suggested that a sudden slowdown in traffic may have less to do with chaos theory than with driver psychology. As traffic gets heavier and the passing lane gets more crowded, aggressive drivers move to other lanes to try to pass, which also tends to even out the speed between lanes. He also felt that another leveling force is that when a driver in a fast lane brakes a little to maintain a safe distance between vehicles, the shock wave travels back much more rapidly than it would in the other slower lanes, because each following driver has to react more quickly. Consequently, as a road becomes congested, the faster moving traffic is the first to slow down.`,
    instructions: "Questions 1-4: Reading Passage has five sections, A-E. Choose the correct heading for each section from the list below. Write the correct number, i-viii. (Example: Section B = i)\n\nList of Headings:\ni. Dramatic effects can result from small changes in traffic just as in nature\nii. How a maths experiment actually reduced traffic congestion\niii. How a concept from one field of study was applied in another\niv. A lack of investment in driver training\nv. Areas of doubt and disagreement between experts\nvi. How different countries have dealt with traffic congestion\nvii. The impact of driver behaviour on traffic speed\nviii. A proposal to take control away from the driver",
    questions: [
      { number: 1, question: 'Section A', answer: 'iii' },
      { number: 2, question: 'Section C', answer: 'viii' },
      { number: 3, question: 'Section D', answer: 'v' },
      { number: 4, question: 'Section E', answer: 'vii' },
    ],
  },
  {
    id: 'matching-sentence-endings',
    title: "Science in 16th-century London — The Jewel House",
    questionType: 'Matching Sentence Endings',
    source: 'IELTS.org Official Sample Task',
    note: "Extract from a Part 3 text about the scientific community in London in the 1500s, reviewing Deborah Harkness's book The Jewel House.",
    passage: `Deborah Harkness devotes her elegant and erudite new book, The Jewel House, to the scientific community in 16th-century London. She (rightly) argues that it is thanks to the imaginative collective efforts of the urban scientists that London became the melting pot in which a new mathematical and experimental culture crystallized.

Harkness is known for her ingenuity as a researcher and her historical empathy. In The Jewel House, Harkness turns her skills on the city of London as a whole with surprising and fascinating results. She began her research by asking herself a new question: not what caused scientific revolution but what the names science and scientist meant in 16th-century London. Then she collected a vast range of sources, from printed books to scientific instruments and notebooks, and recorded, in a relational database, information on the men and women who produced them.

Every chapter of The Jewel House charts the activities of a particular community. Harkness leads us through the streets of London, showing us, neighborhood by neighborhood, where the major forms of natural knowledge found homes. For example, apothecaries settled in Lime Street, in what is now the City, where they created a dense network of shops and gardens. Clockmakers, both native craftsmen and many from overseas, clustered in several parishes near St Paul's Cathedral. The once wealthy merchant, Clement Draper, even managed to transform the King's Bench prison in Southwark, where he served time as a debtor, into a center of research and discussion. By the end of the book Harkness has mapped London's scientific communities with astonishing precision.

Moreover, when Harkness reconstructs these groups, she provides not traditional, static accounts of their theories, but dynamic analyses of their practices as these developed over time. In many cases, she makes clear, the alchemists of Elizabethan London already understood that knowledge of nature had to rest not on authority but on familiarity through practice.

In one crucial respect, Harkness argues, many of the 16th-century London scientists differed from the later ones of the 17th century. They saw themselves less as individuals out to gain fame, than as members of larger textual communities bent on exchanging and compiling information. The passages in which Harkness analyzes the 16th-century practices of note-taking and communication are among the most novel and informative in this fine book. She shows that they adopted the textual information processing methods of humanist scholarship to radically new ends.

In this book, Harkness has charted the local and cosmopolitan worlds of science in Elizabethan London with a learning, precision and intelligence that compel admiration. Moreover, she has crafted a complex and effective new analytical mechanism which may transform the practices of historians of early modern science.`,
    instructions: "Questions 1-3: Complete each sentence with the correct ending, A-F, below.\n\nA. she has the greatest knowledge of Elizabethan London.\nB. she started by seeking to understand how basic terms were used in the past.\nC. they worked as individuals rather than as a group.\nD. she examined how their methods evolved and changed.\nE. Clement Draper was the best scientist of his time.\nF. they used old ways of analysing written information for new purposes.",
    questions: [
      { number: 1, question: "Harkness's research method was different to that of other writers because", answer: 'B' },
      { number: 2, question: "Harkness's reconstruction of the 16th-century London scientific groups was new because", answer: 'D' },
      { number: 3, question: 'Harkness shows that the 16th-century London scientists were innovative because', answer: 'F' },
    ],
  },
  {
    id: 'multiple-choice-multi',
    title: 'Older People in the Workforce (Part 1)',
    questionType: 'Multiple Choice: more than one answer',
    source: 'IELTS.org Official Sample Task (© The Economist)',
    note: "Extract from a Part 1 text about older people in the workforce.",
    passage: `Clearly, when older people do heavy physical work, their age may affect their productivity. But other skills may increase with age, including many that are crucial for good management, such as an ability to handle people diplomatically, to run a meeting or to spot a problem before it blows up. Peter Hicks, who co-ordinates OECD work on the policy implications of ageing, says that plenty of research suggests older people are paid more because they are worth more.

And the virtues of the young may be exaggerated. 'The few companies that have kept on older workers find they have good judgement and their productivity is good,' says Peter Peterson, author of a recent book on the impact of ageing. 'Besides, their education standards are much better than those of today's young high-school graduates.' Companies may say that older workers are not worth training because they are reaching the end of their working lives; in fact, young people tend to switch jobs so frequently that they offer the worst returns on training. The median age for employer-driven training is the late 40s and early 50s, and this training goes mainly to managers.`,
    instructions: "Questions 1-2: Choose TWO letters, A-G. The list below gives some advantages of employing older workers. Which TWO are mentioned by the writer?\n\nA. Less likely to be involved in careless accidents\nB. Can predict areas that may cause trouble in the future\nC. Able to train younger workers\nD. Can deal with unexpected problems\nE. More conscientious\nF. Prepared to work for lower salaries\nG. More skilled in personal relationships",
    questions: [
      { number: 1, question: 'Advantage 1 (either order)', answer: 'B' },
      { number: 2, question: 'Advantage 2 (either order)', answer: 'G' },
    ],
  },
  {
    id: 'multiple-choice-single',
    title: 'Older People in the Workforce (Part 2)',
    questionType: 'Multiple Choice: one answer',
    source: 'IELTS.org Official Sample Task (© The Economist)',
    note: "Extract from a Part 1 text about older people in the workforce.",
    passage: `The general assumption is that older workers are paid more in spite of, rather than because of, their productivity. That might partly explain why, when employers are under pressure to cut costs, they persuade a 55-year old to take early retirement. Take away seniority-based pay scales, and older workers may become a much more attractive employment proposition. But most employers and many workers are uncomfortable with the idea of reducing someone's pay in later life – although manual workers on piece-rates often earn less as they get older. So retaining the services of older workers may mean employing them in different ways.

One innovation was devised by IBM Belgium. Faced with the need to cut staff costs, and having decided to concentrate cuts on 55 to 60-year olds, IBM set up a separate company called Skill Team, which re-employed any of the early retired who wanted to go on working up to the age of 60. An employee who joined Skill Team at the age of 55 on a five-year contract would work for 58% of his time, over the full period, for 88% of his last IBM salary. The company offered services to IBM, thus allowing it to retain access to some of the intellectual capital it would otherwise have lost.

The best way to tempt the old to go on working may be to build on such 'bridge' jobs: part-time or temporary employment that creates a more gradual transition from full-time work to retirement. Studies have found that, in the United States, nearly half of all men and women who had been in full-time jobs in middle age moved into such 'bridge' jobs at the end of their working lives. In general, it is the best-paid and worst-paid who carry on working. There seem to be two very different types of bridge job-holder – those who continue working because they have to and those who continue working because they want to, even though they could afford to retire.

If the job market grows more flexible, the old may find more jobs that suit them. Often, they will be self-employed. Sometimes, they may start their own businesses: a study by David Storey of Warwick University found that in Britain 70% of businesses started by people over 55 survived, compared with an overall national average of only 19%. But whatever pattern of employment they choose, in the coming years the skills of these 'grey workers' will have to be increasingly acknowledged and rewarded.`,
    instructions: "Questions 1-4: Choose the correct letter, A, B, C or D.",
    questions: [
      { number: 1, question: 'In paragraph one, the writer suggests that companies could consider', answer: 'A. abolishing pay schemes that are based on age.' },
      { number: 2, question: 'Skill Team is an example of a company which', answer: 'C. allows the expertise of older workers to be put to use.' },
      { number: 3, question: "According to the writer, 'bridge' jobs", answer: 'D. appeal to distinct groups of older workers.' },
      { number: 4, question: "David Storey's study found that", answer: 'B. older people are good at running their own businesses.' },
    ],
  },
  {
    id: 'note-completion',
    title: 'The Life and Work of Marie Curie (Part 2)',
    questionType: 'Note Completion',
    source: 'IELTS.org Official Sample Task (adapted from Encyclopaedia Britannica)',
    note: "Extract from a Part 1 text about the scientist Marie Curie's research on radioactivity.",
    passage: `The marriage of Pierre and Marie Curie in 1895 marked the start of a partnership that was soon to achieve results of world significance. Following Henri Becquerel's discovery in 1896 of a new phenomenon, which Marie later called 'radioactivity', Marie Curie decided to find out if the radioactivity discovered in uranium was to be found in other elements. She discovered that this was true for thorium.

Turning her attention to minerals, she found her interest drawn to pitchblende, a mineral whose radioactivity, superior to that of pure uranium, could be explained only by the presence in the ore of small quantities of an unknown substance of very high activity. Pierre Curie joined her in the work that she had undertaken to resolve this problem, and that led to the discovery of the new elements, polonium and radium. While Pierre Curie devoted himself chiefly to the physical study of the new radiations, Marie Curie struggled to obtain pure radium in the metallic state. This was achieved with the help of the chemist André-Louis Debierne, one of Pierre Curie's pupils. Based on the results of this research, Marie Curie received her Doctorate of Science, and in 1903 Marie and Pierre shared with Becquerel the Nobel Prize for Physics for the discovery of radioactivity.

The births of Marie's two daughters, Irène and Eve, in 1897 and 1904 failed to interrupt her scientific work. She was appointed lecturer in physics at the École Normale Supérieure for girls in Sèvres, France (1900), and introduced a method of teaching based on experimental demonstrations. In December 1904 she was appointed chief assistant in the laboratory directed by Pierre Curie.

The sudden death of her husband in 1906 was a bitter blow to Marie Curie, but was also a turning point in her career: henceforth she was to devote all her energy to completing alone the scientific work that they had undertaken. On May 13, 1906, she was appointed to the professorship that had been left vacant on her husband's death, becoming the first woman to teach at the Sorbonne. In 1911 she was awarded the Nobel Prize for Chemistry for the isolation of a pure form of radium.

During World War I, Marie Curie, with the help of her daughter Irène, devoted herself to the development of the use of X-radiography, including the mobile units which came to be known as 'Little Curies', used for the treatment of wounded soldiers. In 1918 the Radium Institute, whose staff Irène had joined, began to operate in earnest, and became a centre for nuclear physics and chemistry. Marie Curie, now at the highest point of her fame and, from 1922, a member of the Academy of Medicine, researched the chemistry of radioactive substances and their medical applications.

In 1921, accompanied by her two daughters, Marie Curie made a triumphant journey to the United States to raise funds for research on radium. Women there presented her with a gram of radium for her campaign. Marie also gave lectures in Belgium, Brazil, Spain and Czechoslovakia and, in addition, had the satisfaction of seeing the development of the Curie Foundation in Paris, and the inauguration in 1932 in Warsaw of the Radium Institute, where her sister Bronia became director.

One of Marie Curie's outstanding achievements was to have understood the need to accumulate intense radioactive sources, not only to treat illness but also to maintain an abundant supply for research. The existence in Paris at the Radium Institute of a stock of 1.5 grams of radium made a decisive contribution to the success of the experiments undertaken in the years around 1930. This work prepared the way for the discovery of the neutron by Sir James Chadwick and, above all, for the discovery in 1934 by Irène and Frédéric Joliot-Curie of artificial radioactivity. A few months after this discovery, Marie Curie died as a result of leukaemia caused by exposure to radiation. She had often carried test tubes containing radioactive isotopes in her pocket, remarking on the pretty blue-green light they gave off.

Her contribution to physics had been immense, not only in her own work, the importance of which had been demonstrated by her two Nobel Prizes, but because of her influence on subsequent generations of nuclear physicists and chemists.`,
    instructions: "Questions 1-6: Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.\n\nMarie Curie's research on radioactivity:\n- When uranium was discovered to be radioactive, Marie Curie found the element called [1] had the same property.\n- Research into the radioactivity of the mineral known as [2] led to the discovery of two new elements.\n- In 1911, Marie Curie received recognition for her work on the element [3].\n- Marie and Irène developed X-radiography used as a medical technique for [4].\n- Marie Curie saw the importance of collecting radioactive material for research and for cases of [5].\n- The radioactive material in Paris contributed to discoveries in the 1930s of the [6] and artificial radioactivity.",
    questions: [
      { number: 1, question: 'Element also found to be radioactive like uranium', answer: 'thorium' },
      { number: 2, question: 'Mineral whose radioactivity led to two new elements', answer: 'pitchblende' },
      { number: 3, question: 'Element Marie Curie was recognized for in 1911', answer: 'radium' },
      { number: 4, question: 'X-radiography was used to treat these', answer: 'soldiers' },
      { number: 5, question: 'Radioactive material was collected for research and cases of this', answer: 'illness' },
      { number: 6, question: 'Discovery in the 1930s alongside artificial radioactivity', answer: 'neutron' },
    ],
  },
  {
    id: 'sentence-completion',
    title: 'The Origins of Birds',
    questionType: 'Sentence Completion',
    source: 'IELTS.org Official Sample Task',
    note: "Extract from a Part 2 task about the evolution of birds and their ancestry.",
    passage: `The science of evolutionary relationships has undergone a major change in recent decades. It used to be the case that all the features of organisms were important in working out their family tree. But following the work of German entomologist Willi Hennig, many evolutionary scientists now believe that the only features which carry any useful information are the evolutionary 'novelties' shared between organisms. Mice, lizards and fish, for example, all have backbones – so the feature 'backbone' tells us nothing about their evolutionary relationship. But the feature 'four legs' is useful because it's an evolutionary novelty – a characteristic shared only between the lizard and the mouse. This would suggest that the lizard and mouse are more closely related to each other than either is to the fish. This revolutionary approach is called cladistics, and it has been central to the idea that birds evolved from dinosaurs.

The 'birds are dinosaurs' theory was first developed by English palaeontologist Thomas Huxley (1825–1895). According to some accounts, one evening Huxley went to dinner still thinking about a mystery dinosaur bone in his lab. He knew he was dealing with the lower leg bone (tibia) of a meat-eating, two-legged dinosaur belonging to the classification known as theropods, but attached to the tibia was an unidentified extra bone. On the menu that evening was quail, a small bird similar to a pheasant, and Huxley noticed the same strange bone, attached to the quail tibia on his plate. He later realised that it was in fact the bird's anklebone. More importantly, Huxley concluded that its forms in both dinosaur and bird skeletons were so similar that they must be closely related.

Huxley's idea fell out of favour for fifty years following the 1916 publication of The Origin of Birds by the Danish doctor Gerhard Heilmann. During this time, Heilmann's theory was widely accepted. Heilmann had noted that two-legged, meat-eating dinosaurs lacked collarbones. In later evolutionary stages these bones fuse together to form the distinctive 'Y'-shaped bone in a bird's neck, known as the furcula. Heilmann proposed the notion that such a feature could not be lost and then re-evolve at a later date, so dinosaurs could not be the ancestors of birds.

Then, in the late 1960s, John Ostrom from Yale University in the US, noted 22 features in the skeletons of meat-eating dinosaurs that were also found in birds and nowhere else. This reset the thinking on bird ancestry and once again Huxley's ideas caught the attention of the scientific community. Subsequent work has found up to 85 characteristics that tie dinosaurs and birds together. But what of Heilmann's missing bones? It turns out that not only did many dinosaurs have collarbones, these were also fused together into a furcula. Unfortunately for Heilmann, the fossil evidence was somewhat lacking in his day, and the few furculae that had been found were misidentified, usually as belly ribs.

US ornithologist Alan Feduccia and palaeontologist Larry Martin are two vocal opponents of the dinosaur theory. They contend that birds evolved from some unknown reptile at a time long before dinosaurs. Their reasoning is that flight is most likely to have started from a tree-climbing ancestor, yet all the proposed dinosaurian ancestors were ground-dwellers. But the dino-bird supporters contend that an unknown dinosaurian bird-ancestor could have been tree-dwelling, or that birds evolved flight from the ground up by chasing and leaping after insects. Most of Feduccia and Martin's case against the 'birds-are-dinosaurs' hypothesis is based on differences between birds and dinosaurs. Supporters of cladistics, however, maintain that differences between organisms do not matter, as it is the similarities between them that count. Evolution dictates that organisms will change through time, so it is only the features which persist that carry useful information about their origins.

Most people on either side of the debate do accept, however, that the ancient winged creature known as Archaeopteryx is an ancestor of today's birds. This is in spite of the fact that its form is distinctly non-bird-like, with a long bony tail, and teeth instead of a beak. The 'birds-are-dinosaurs' supporters contend that, if clearly-preserved feathers had not been found alongside two of the seven Archaeopteryx specimens, it would probably have been identified as a small dinosaur. However, Archaeopteryx does have some bird-like features, such as a furcula and bird-like feet, that suggest that it is too bird-like to be considered a dinosaur.

Over the last few decades several dinosaurs with bird-like features and primitive birds with dinosaur-like features have been found in several countries, connecting Archaeopteryx back to dinosaurs, and forwards to modern birds. Sinosauropteryx, excavated from 130-million-year-old rocks in northeast China, is one example. It is a dinosaur skeleton surrounded by a halo of fuzz, thought to be primitive feathers. And a reassessment of other dinosaurs reveals such bird-like features as hollow bones and a foot with three functional toes, characteristics that appeared over 50 million years before Archaeopteryx took to the air. And Rahonavis, a primitive bird from Madagascar is more bird-like than Archaeopteryx, yet retains some distinctive dinosaur features, including a long and vicious claw at the end of its wing. Over a century since Huxley's discovery, it seems that cladistics may have finally settled the 'dino-bird' debate.`,
    instructions: "Questions 1-5: Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer.",
    questions: [
      { number: 1, question: 'Huxley formulated his theory while studying a dinosaur belonging to a group called ___.', answer: 'theropods' },
      { number: 2, question: 'Heilmann rejected Huxley\'s theory because of the apparent absence of ___ in dinosaurs.', answer: 'collarbones' },
      { number: 3, question: "Feduccia and Martin believe that the ancestor of today's birds was a kind of early ___.", answer: 'reptile' },
      { number: 4, question: 'In cladistics, the ___ between organisms\' characteristics are of major importance.', answer: 'similarities' },
      { number: 5, question: "The dangerous ___ on a primitive bird from Madagascar adds weight to the 'dino-bird' argument.", answer: 'claw' },
    ],
  },
  {
    id: 'summary-completion-list',
    title: "'This Marvellous Invention' — Language",
    questionType: 'Summary Completion (list of words)',
    source: 'IELTS.org Official Sample Task (© Guy Deutscher)',
    note: "Extract from a Part 3 text about language.",
    passage: `Of all mankind's manifold creations, language must take pride of place. Other inventions – the wheel, agriculture, sliced bread – may have transformed our material existence, but the advent of language is what made us human. Compared to language, all other inventions pale in significance, since everything we have ever achieved depends on language and originates from it. Without language, we could never have embarked on our ascent to unparalleled power over all other animals, and even over nature itself.

But language is foremost not just because it came first. In its own right it is a tool of extraordinary sophistication, yet based on an idea of ingenious simplicity: 'this marvellous invention of composing out of twenty-five or thirty sounds that infinite variety of expressions which, whilst having in themselves no likeness to what is in our mind, allow us to disclose to others its whole secret, and to make known to those who cannot penetrate it all that we imagine, and all the various stirrings of our soul'. This was how, in 1660, the renowned French grammarians of the Port-Royal abbey near Versailles distilled the essence of language, and no one since has celebrated more eloquently the magnitude of its achievement. Even so, there is just one flaw in all these hymns of praise, for the homage to language's unique accomplishment conceals a simple yet critical incongruity. Language is mankind's greatest invention – except, of course, that it was never invented. This apparent paradox is at the core of our fascination with language, and it holds many of its secrets.`,
    instructions: "Questions 1-4: Complete the summary using the list of words, A-G, below.\n\nA. difficult  B. complex  C. original  D. admired  E. material  F. easy  G. fundamental\n\n'The wheel is one invention that has had a major impact on [1] aspects of life, but no impact has been as [2] as that of language. Language is very [3], yet composed of just a small number of sounds. Language appears to be [4] to use. However, its sophistication is often overlooked.'",
    questions: [
      { number: 1, question: 'Blank 1', answer: 'E' },
      { number: 2, question: 'Blank 2', answer: 'G' },
      { number: 3, question: 'Blank 3', answer: 'B' },
      { number: 4, question: 'Blank 4', answer: 'F' },
    ],
  },
  {
    id: 'summary-completion-text',
    title: 'The Plain English Movement',
    questionType: 'Summary Completion (words from text)',
    source: 'IELTS.org Official Sample Task (© David Crystal, Cambridge University Press)',
    note: "Extract from a Part 3 text about the 'Plain English' movement, which promotes the use of clear English.",
    passage: `The instructions accompanying do-it-yourself products are regularly cited as a source of unnecessary expense or frustration. Few companies seem to test their instructions by having them followed by a first-time user. Often, essential information is omitted, steps in the construction process are taken for granted, and some degree of special knowledge is assumed. This is especially worrying in any fields where failure to follow correct procedures can be dangerous.

Objections to material in plain English have come mainly from the legal profession. Lawyers point to the risk of ambiguity inherent in the use of everyday language for legal or official documents, and draw attention to the need for confidence in legal formulations, which can come only from using language that has been tested in courts over the course of centuries. The campaigners point out that there has been no sudden increase in litigation as a consequence of the increase in plain English materials.

Similarly, professionals in several different fields have defended their use of technical and complex language as being the most precise means of expressing technical or complex ideas. This is undoubtedly true: scientists, doctors, bankers and others need their jargon in order to communicate with each other succinctly and unambiguously. But when it comes to addressing the non-specialist consumer, the campaigners argue, different criteria must apply.`,
    instructions: "Questions 1-5: Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.\n\n'Consumers often complain that they experience a feeling of [1] when trying to put together do-it-yourself products which have not been tested by companies on a [2]. In situations where not keeping to the correct procedures could affect safety issues, it is especially important that [3] information is not left out and no assumptions are made about a stage being self-evident or the consumer having a certain amount of [4]. Lawyers, however, have raised objections to the use of plain English. They feel that it would result in ambiguity in documents and cause people to lose faith in [5], as it would mean departing from language that has been used in the courts for a very long time.'",
    questions: [
      { number: 1, question: 'Blank 1', answer: 'frustration' },
      { number: 2, question: 'Blank 2', answer: 'first-time user' },
      { number: 3, question: 'Blank 3', answer: 'essential' },
      { number: 4, question: 'Blank 4', answer: 'special knowledge' },
      { number: 5, question: 'Blank 5', answer: 'legal formulations' },
    ],
  },
  {
    id: 'diagram-label',
    title: 'The Seawater Greenhouse',
    questionType: 'Diagram Label Completion',
    source: 'IELTS.org Official Sample Task',
    note: "Extract from a passage on a method of providing water to grow vegetables in desert regions.",
    passage: `Charlie Paton has built a giant structure on a desert island off Abu Dhabi in the Persian Gulf – the first commercially viable version of his 'seawater greenhouse'. Local scientists, working with Paton under a licence from his company Light Works, are watering the desert and growing vegetables in what is basically a giant dew-making machine that produces fresh water and cool air from sun and seawater.

The design has three main features. Firstly, there is a front wall of perforated cardboard through which hot, dry air blows in from the desert. This wall is kept moist by seawater pumped up from the nearby shoreline. As this water evaporates, heat is taken from the air inside the greenhouse and moisture added to it. Last June, for example, when the temperature outside the Abu Dhabi greenhouse was 46°C, it was in the low 30s inside and the humidity in the greenhouse was 90 per cent. The cool, moist air inside the greenhouse allows the plants to grow faster, and because much less water evaporates from the leaves, their demand for moisture drops dramatically. Paton's crops thrived on a single litre of water per square metre per day, compared to 8 litres if they were growing outside.

The second feature also serves to cool the air for the plants. Paton has constructed a double-layered roof with an outer layer of clear polythene and an inner, coated layer that reflects infrared light. Visible light can stream through to maximise photosynthesis, while infrared radiation is trapped in the space between the layers, away from the plants.

At the back of the greenhouse sits the third element, the main water-production unit. Just before entering this unit, the humid air of the greenhouse mixes with the hot, dry air from between the two layers of the roof. This means the air can absorb more moisture as it passes through a second perforated cardboard wall. Finally, the hot saturated air hits a condenser. This is kept cool by still more seawater. Drops of pure distilled water form on the condenser and flow into a tank for irrigating the crops.

The greenhouse more or less runs itself. Sensors switch everything on when the sun rises, and alter flows of air and seawater through the day in response to changes in temperature, humidity and sunlight. On windless days, a fan ensures a constant flow of air through the greenhouse. 'Once it is tuned to the local environment, you don't need anyone there for it to work,' says Paton. 'We can run the entire operation off one 13-amp plug, and in future we could make it entirely independent of the grid, powered from solar panels.'`,
    instructions: "Questions 1-5: Label the diagram of the Seawater Greenhouse. Choose NO MORE THAN THREE WORDS from the passage for each answer.\n\nDiagram shows: [1] entering through the front cardboard wall → passes plants as [2] → sun's [3] reflected by roof layer → air reaches [4] at water production unit → produces [5] flowing to tank for irrigation",
    questions: [
      { number: 1, question: 'Air entering through the front wall (from the desert)', answer: 'hot dry air' },
      { number: 2, question: 'Air after passing the plants', answer: 'cool moist air' },
      { number: 3, question: 'What the roof reflects away from the plants', answer: 'infrared radiation' },
      { number: 4, question: 'What the hot saturated air hits at the water production unit', answer: 'condenser' },
      { number: 5, question: 'What forms on the condenser and flows to the tank', answer: 'pure distilled water' },
    ],
  },
];

export function getOfficialPassageById(id) {
  return OFFICIAL_PASSAGES.find(p => p.id === id);
}
