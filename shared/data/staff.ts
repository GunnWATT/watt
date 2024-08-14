export type Staff = {
    name: string, title?: string, email?: string, room?: string,
    dept: string, phone?: string, ext?: string
};

const data: {timestamp: string, data: {[key: string]: Staff}} = {
    "timestamp": "2024-08-13T22:49:52.635Z",
    "data": {
        "10021": {
            "email": "stiruchinapally@pausd.org",
            "name": "Srilatha Tiruchinapally",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "10150": {
            "email": "gcheema@pausd.org",
            "name": "Gagan Cheema",
            "dept": "Athletic Trainer",
            "phone": "354-8257"
        },
        "10619": {
            "email": "smcginn@pausd.org",
            "name": "Shawn McGinn",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S102"
        },
        "13143": {
            "email": "nmedina@pausd.org",
            "name": "Norma Medina",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "G2",
            "ext": "5006"
        },
        "13761": {
            "email": "amanderson@pausd.org",
            "name": "Amy Anderson",
            "dept": "PE",
            "phone": "354-8215",
            "room": "Gym",
            "ext": "6752"
        },
        "13946": {
            "email": "cjohnson@pausd.org",
            "name": "Chris Johnson",
            "dept": "Social Studies",
            "phone": "354-8237"
        },
        "15499": {
            "email": "ashinh@pausd.org",
            "name": "Arshdeep Shinh",
            "dept": "Transitionist",
            "room": "K10",
            "phone": ""
        },
        "16677": {
            "email": "asheridan@pausd.org",
            "name": "Angeline Sheridan",
            "dept": "Adaptive PE",
            "phone": "354-8257",
            "room": "Gym"
        },
        "16910": {
            "email": "bgonzalez@pausd.org",
            "name": "Briana Gonzalez",
            "dept": "SpEd/Dept. Head",
            "phone": "354-8262",
            "room": "K15"
        },
        "17229": {
            "email": "slo@pausd.org",
            "name": "Sophia Lo",
            "dept": "Speech Therapist",
            "phone": "354-8230",
            "room": "F4",
            "ext": "1414"
        },
        "19554": {
            "email": "klangdon@pausd.org",
            "name": "Kyle Langdon",
            "dept": "Spangenberg Coordinator",
            "phone": "354-8220, 906-0223",
            "room": "Spangenberg"
        },
        "20212": {
            "email": "ssheth@pausd.org",
            "name": "Shilpan Sheth",
            "dept": "Science",
            "phone": ""
        },
        "20218": {
            "email": "rirshad@pausd.org",
            "name": "Rehman Irshad",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K bldg"
        },
        "20250": {
            "email": "dbisbee@pausd.org",
            "name": "David Bisbee",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "V25"
        },
        "20453": {
            "email": "mbautista@pausd.org",
            "name": "Michael Bautista",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N204",
            "ext": "6781"
        },
        "20547": {
            "email": "cpeters@pausd.org",
            "name": "Cindy Peters",
            "dept": "CTE/Dept. Head",
            "phone": "354-8245",
            "room": "K3, K5",
            "ext": "5544"
        },
        "20765": {
            "email": "mcaballero@pausd.org",
            "name": "Maria Caballero",
            "dept": "Food Services",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "20854": {
            "email": "erobinson@pausd.org",
            "name": "Elizabeth Robinson",
            "dept": "Cafeteria",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "21801": {
            "email": "jpatrick@pausd.org",
            "name": "Jeff Patrick",
            "dept": "Social Studies",
            "phone": "354-8247",
            "room": "K8",
            "ext": "5165"
        },
        "21839": {
            "email": "nxu@pausd.org",
            "name": "Ning Xu",
            "dept": "Science",
            "phone": "354-8246"
        },
        "22282": {
            "email": "dtabares@pausd.org",
            "name": "Daissy Tabares",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "G7"
        },
        "22734": {
            "email": "jmoses@pausd.org",
            "name": "Jayme Moses",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "23126": {
            "email": "aletner@pausd.org",
            "name": "Alexis Letner",
            "dept": "ELL Coordinator/Dept Head",
            "phone": ""
        },
        "23457": {
            "email": "mhixon@pausd.org",
            "name": "Mycal Hixon",
            "dept": "Assistant Principal",
            "phone": "354-8200"
        },
        "24075": {
            "email": "tninooliva@pausd.org",
            "name": "Teresa Nino-Oliva",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "G1",
            "ext": "5405"
        },
        "24281": {
            "email": "lpennington@pausd.org",
            "name": "Laurie Pennington",
            "dept": "Science",
            "phone": "354-8246",
            "room": "J5, L1",
            "ext": "5215"
        },
        "24348": {
            "email": "dwang@pausd.org",
            "name": "Siu",
            "dept": "Math",
            "phone": "354-8247"
        },
        "24372": {
            "email": "psteward@pausd.org",
            "name": "Pamela Steward",
            "dept": "Academic Center",
            "phone": "354-8271",
            "room": "D2",
            "ext": "1510"
        },
        "24904": {
            "email": "jchavez@pausd.org",
            "name": "Jorge Chavez",
            "dept": "Guidance",
            "phone": "354-8226",
            "room": "P bldg, 2nd floor",
            "ext": "5406"
        },
        "25867": {
            "email": "thanie@pausd.org",
            "name": "TK Hanie",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K9"
        },
        "26094": {
            "email": "dleftwich@pausd.org",
            "name": "David Leftwich",
            "dept": "Guidance/Lead Counselor",
            "phone": "354-8225",
            "room": "P bldg, 2nd floor",
            "ext": "4710"
        },
        "26409": {
            "email": "llang@pausd.org",
            "name": "Leighton Lang",
            "dept": "College+Career Center",
            "phone": "354-8219",
            "room": "P233",
            "ext": "6267"
        },
        "26417": {
            "email": "flimburg@pausd.org",
            "name": "Florina Limburg",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N207",
            "ext": "5975"
        },
        "26776": {
            "email": "rkaci@pausd.org",
            "name": "Rachael Kaci",
            "dept": "Work Experience",
            "phone": "833-4239",
            "room": "V1",
            "ext": "5934"
        },
        "26840": {
            "email": "djohanson@pausd.org",
            "name": "Derek Johanson",
            "dept": "Guidance",
            "phone": "849-7935",
            "room": "P bldg, 2nd floor",
            "ext": "6818"
        },
        "27128": {
            "email": "ecorpuz@pausd.org",
            "name": "Ed Corpuz",
            "dept": "CTE",
            "phone": "849-7905",
            "room": "L6",
            "ext": "6105"
        },
        "27606": {
            "email": "jlee@pausd.org",
            "name": "Jena Lee",
            "dept": "Science",
            "phone": "354-8246",
            "room": "J4, J2",
            "ext": "6582"
        },
        "28472": {
            "email": "yvrudny@pausd.org",
            "name": "Yanan Vrudny",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "H3",
            "ext": "6182"
        },
        "29738": {
            "email": "kgranlund@pausd.org",
            "name": "Kristina Granlund",
            "dept": "CTE",
            "phone": "354-8254",
            "room": "F4, F5, L4",
            "ext": "6722"
        },
        "29758": {
            "email": "lcollart@pausd.org",
            "name": "Lisa Collart",
            "dept": "Academic Center",
            "phone": "354-8271",
            "room": "D2"
        },
        "29937": {
            "email": "tgrim@pausd.org",
            "name": "Tomas Grim",
            "dept": "CTE",
            "phone": ""
        },
        "30595": {
            "email": "nvidonia@pausd.org",
            "name": "Nestor Vidonia",
            "dept": "Custodian",
            "phone": "354-8205",
            "room": "Custodial"
        },
        "31135": {
            "email": "cross@pausd.org",
            "name": "Cora Ross",
            "dept": "Guidance",
            "phone": "354-8290",
            "room": "P bldg, 2nd fl.",
            "ext": "4711"
        },
        "32043": {
            "email": "ocelis@pausd.org",
            "name": "Olga Celis",
            "dept": "Technology",
            "phone": "354-8285",
            "room": "E building",
            "ext": "6359"
        },
        "32576": {
            "email": "tshi@pausd.org",
            "name": "Tingting Shi",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "32711": {
            "email": "moclark@pausd.org",
            "name": "Monica Clark",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K9"
        },
        "33103": {
            "email": "jowen@pausd.org",
            "name": "Janet Owen",
            "dept": "Principal's Secretary",
            "phone": "354-8210",
            "room": "E building",
            "ext": "5721"
        },
        "33337": {
            "email": "cschroeppel@pausd.org",
            "name": "Claudia Schroeppel",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "H2",
            "ext": "6458"
        },
        "33603": {
            "email": "tkaneko@pausd.org",
            "name": "Takeshi Kaneko",
            "dept": "Math/Tech TOSA",
            "phone": "354-8247",
            "room": "N115"
        },
        "34070": {
            "email": "kmartinez@pausd.org",
            "name": "Keanna Martinez",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "35254": {
            "email": "coconnell@pausd.org",
            "name": "Casey O'Connell",
            "dept": "Science",
            "phone": "354-8246",
            "room": "J6",
            "ext": "5582"
        },
        "35462": {
            "email": "mhlasek@pausd.org",
            "name": "Misha Hlasek",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N205"
        },
        "36350": {
            "email": "lhall@pausd.org",
            "name": "Lisa Hall",
            "dept": "English/SEC",
            "phone": "354-8228",
            "room": "P-105",
            "ext": "5956"
        },
        "37282": {
            "email": "kcatalano@pausd.org",
            "name": "Kathryn Catalano",
            "dept": "Assistant Principal",
            "phone": "354-8200",
            "room": "J8",
            "ext": "6953"
        },
        "37551": {
            "email": "mweisman@pausd.org",
            "name": "Mark Weisman",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "V26",
            "ext": "6094"
        },
        "39153": {
            "email": "ehalter@pausd.org",
            "name": "Ethan Halter",
            "dept": "English",
            "phone": "354-8238",
            "room": "N107",
            "ext": "5429"
        },
        "39959": {
            "email": "egaribaydiaz@pausd.org",
            "name": "Erika Diaz",
            "dept": "SpEd Aide",
            "phone": "354-8200",
            "room": "K14"
        },
        "40148": {
            "email": "wcollier@pausd.org",
            "name": "Warren Collier",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "C2",
            "ext": "6382"
        },
        "40491": {
            "email": "sgutkin@pausd.org",
            "name": "Sophie Magid-Gutkin",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "40657": {
            "email": "sheupel@pausd.org",
            "name": "McDonnell",
            "dept": "Math",
            "phone": "354-8247"
        },
        "41651": {
            "email": "nbato@pausd.org",
            "name": "Normalynn Bato",
            "dept": "Food Services",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "41659": {
            "email": "gmiller@pausd.org",
            "name": "Greg Miller",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S102"
        },
        "41963": {
            "email": "stdavidson@pausd.org",
            "name": "Stacey Davidson",
            "dept": "SaFE",
            "phone": "354-8294",
            "room": "C8",
            "ext": "1451"
        },
        "42076": {
            "email": "cgleeson@pausd.org",
            "name": "Clare Gleeson",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K10"
        },
        "42311": {
            "email": "bliberatore@pausd.org",
            "name": "Bill Liberatore",
            "dept": "VAPA",
            "phone": "354-8287",
            "room": "S121",
            "ext": "5130"
        },
        "43431": {
            "email": "cdean@pausd.org",
            "name": "Chris Dean",
            "dept": "Custodial",
            "phone": "354-8205",
            "room": "Custodian"
        },
        "43576": {
            "email": "llibbey@pausd.org",
            "name": "Liz Libbey",
            "dept": "Guidance Dept. Secretary",
            "phone": "354-8212",
            "room": "P bldg,2nd floor",
            "ext": "1662"
        },
        "44690": {
            "email": "tradhika@pausd.org",
            "name": "Thampuran Radhika",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "47914": {
            "email": "hnewland@pausd.org",
            "name": "Harvey Newland",
            "dept": "Assistant Principal",
            "phone": "354-8260",
            "room": "E building",
            "ext": "6885"
        },
        "48326": {
            "email": "pdunlap@pausd.org",
            "name": "Paul Dunlap",
            "dept": "English",
            "phone": "354-8238",
            "room": "N114"
        },
        "49517": {
            "email": "CCuevas@pausd.org",
            "name": "Cristal Cuevas",
            "dept": "Health Office",
            "phone": "354-8200"
        },
        "50039": {
            "email": "rcastillo@pausd.org",
            "name": "Rosie Castillo",
            "dept": "Wellness",
            "phone": "354-8214",
            "room": "P231",
            "ext": "6941"
        },
        "50378": {
            "email": "yrivera@pausd.org",
            "name": "Yesenia Rivera",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "50709": {
            "email": "jmunger@pausd.org",
            "name": "Julie Munger",
            "dept": "English",
            "phone": "354-8238",
            "room": "N111",
            "ext": "6229"
        },
        "51060": {
            "email": "jdbrown@pausd.org",
            "name": "Justin Brown",
            "dept": "English",
            "phone": "354-8238",
            "room": "N106",
            "ext": "6084"
        },
        "51429": {
            "email": "jwells@pausd.org",
            "name": "Jordan Wells",
            "dept": "English",
            "phone": "354-8238",
            "room": "N101",
            "ext": "6074"
        },
        "51781": {
            "email": "abueno@pausd.org",
            "name": "Andrea Bueno",
            "dept": "Guidance",
            "phone": "354-8263",
            "room": "P bldg, 2nd floor",
            "ext": "6531"
        },
        "51832": {
            "email": "dlinsdell@pausd.org",
            "name": "Dawna Linsdell",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "V5",
            "ext": "5229"
        },
        "52247": {
            "email": "skaur@pausd.org",
            "name": "Roma Kaur",
            "dept": "Aide",
            "phone": ""
        },
        "52507": {
            "email": "nhesterman@pausd.org",
            "name": "Norma Hesterman",
            "dept": "Volunteer Coordinator",
            "phone": "354-8234",
            "room": "C8",
            "ext": "5095"
        },
        "53716": {
            "email": "jellington@pausd.org",
            "name": "Jennifer Ellington",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S1",
            "ext": "5366"
        },
        "53776": {
            "email": "bberesford@pausd.org",
            "name": "Ben Beresford",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "C3"
        },
        "53995": {
            "email": "Eolah@pausd.org",
            "name": "Erik Olah",
            "dept": "Assistant Principal",
            "phone": "354-8200"
        },
        "54009": {
            "email": "aloomis@pausd.org",
            "name": "Audrey Loomis",
            "dept": "Testing Resource Center (TRC)",
            "phone": "354-8272",
            "room": "D-1",
            "ext": "1536"
        },
        "55208": {
            "email": "dwhichard@pausd.org",
            "name": "Danielle Whichard",
            "dept": "English/AVID",
            "phone": "354-8238",
            "room": "N109",
            "ext": "5454"
        },
        "55632": {
            "email": "mcamacho@pausd.org",
            "name": "Lupe Camacho",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K bldg"
        },
        "55907": {
            "email": "jchoi@pausd.org",
            "name": "Julia Choi",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N212"
        },
        "55999": {
            "email": "nmenache@pausd.org",
            "name": "Nicole Menache",
            "dept": "English/AAR/FOS",
            "phone": "354-8238",
            "room": "K14, N102",
            "ext": "5220"
        },
        "56043": {
            "email": "ccismas@pausd.org",
            "name": "Cristina Florea",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N205"
        },
        "56631": {
            "email": "dgill@pausd.org",
            "name": "Daljeet Gill",
            "dept": "Librarian",
            "phone": "354-8252",
            "room": "Library",
            "ext": "6802"
        },
        "56887": {
            "email": "anicholson@pausd.org",
            "name": "Alana Nicholson",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "57075": {
            "email": "ATuomy@pausd.org",
            "name": "Ariane Tuomy",
            "dept": "Social Studies",
            "phone": ""
        },
        "57090": {
            "email": "kja@pausd.org",
            "name": "Katherine Ja",
            "dept": "English",
            "phone": "354-8238",
            "room": "N113",
            "ext": "6957"
        },
        "57244": {
            "email": "qwang@pausd.org",
            "name": "Ching (Qingmin) Wang",
            "dept": "SaFE",
            "room": "C8",
            "phone": ""
        },
        "57530": {
            "email": "rpena@pausd.org",
            "name": "Rosanna Pena",
            "dept": "ERMHS Therapist",
            "phone": "354-8200",
            "room": "K10-B",
            "ext": "1498"
        },
        "57913": {
            "email": "rcongress@pausd.org",
            "name": "Rachel Congress",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N201",
            "ext": "5719"
        },
        "58138": {
            "email": "lkousnetz@pausd.org",
            "name": "Leslie Kousnetz",
            "dept": "SAC clerk",
            "phone": "354-8229",
            "room": "P106",
            "ext": "6214"
        },
        "58637": {
            "email": "vbuck@pausd.org",
            "name": "Victoria Buck",
            "dept": "VAPA",
            "phone": ""
        },
        "59677": {
            "email": "mjackson@pausd.org",
            "name": "Michelle Jackson",
            "dept": "BIC/SpEd",
            "phone": ""
        },
        "59932": {
            "email": "jfidani@pausd.org",
            "name": "Jon Fidani",
            "dept": "Guidance",
            "phone": "354-8224",
            "room": "P bldg, 2nd floor",
            "ext": "6917"
        },
        "60766": {
            "email": "kblackburn@pausd.org",
            "name": "Kristy Blackburn",
            "dept": "English/Yearbook/Oracle",
            "phone": "354-8238",
            "room": "P115, 117",
            "ext": "5112"
        },
        "61165": {
            "email": "wstratton@pausd.org",
            "name": ", Ed. D.",
            "dept": "Principal",
            "phone": "354-8288"
        },
        "61633": {
            "email": "rochoa@pausd.org",
            "name": "Richelle Ochoa",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "61940": {
            "email": "szaidi@pausd.org",
            "name": "Syed Zaidi",
            "dept": "Technology",
            "phone": "329- 3721",
            "room": "V15",
            "ext": "5559"
        },
        "62794": {
            "email": "mgleason@pausd.org",
            "name": "Mark Gleason",
            "dept": "VAPA",
            "phone": "849-7906",
            "room": "P114, M1",
            "ext": "5981"
        },
        "62837": {
            "email": "sames@pausd.org",
            "name": "Steve Ames",
            "dept": "PE",
            "phone": "354-8266",
            "room": "Gym & V17",
            "ext": "5242"
        },
        "63448": {
            "email": "cmunoz@pausd.org",
            "name": "Chris Munoz",
            "dept": "Technology",
            "phone": "354-8292",
            "room": "V15",
            "ext": "6874"
        },
        "63639": {
            "email": "ddeggeller@pausd.org",
            "name": "David Deggeller",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N208",
            "ext": "5327"
        },
        "64295": {
            "email": "mjamison@pausd.org",
            "name": "Marcus Jamison",
            "dept": "Math",
            "phone": "",
            "room": "N210"
        },
        "64834": {
            "email": "klo@pausd.org",
            "name": "Kristen Lo",
            "dept": "VAPA",
            "phone": "354-8258",
            "room": "S1, S147",
            "ext": "5682"
        },
        "64908": {
            "email": "jordonez@pausd.org",
            "name": "Joey Ordonez",
            "dept": "SaFE",
            "phone": "354-8222",
            "room": "C8",
            "ext": "1681/5691"
        },
        "65100": {
            "email": "bcreighton@pausd.org",
            "name": "Braumon Creighton",
            "dept": "PE",
            "phone": "354-8266",
            "room": "Gym",
            "ext": "6954"
        },
        "65155": {
            "email": "mgarcia@pausd.org",
            "name": "Megan Garcia",
            "dept": "Assistant Librarian",
            "phone": "354-8252",
            "room": "Library",
            "ext": "6802"
        },
        "66745": {
            "email": "nmatta@pausd.org",
            "name": "Nora Matta",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "F6",
            "ext": "6959"
        },
        "67140": {
            "email": "lhoward@pausd.org",
            "name": "Laurel Howard",
            "dept": "Social Studies/SELF TOSA",
            "phone": "354-8237",
            "room": "C4"
        },
        "67286": {
            "email": "kweymouth@pausd.org",
            "name": "Kate Weymouth",
            "dept": "English/Dept. Head",
            "phone": "354-8238",
            "room": "N110",
            "ext": "6960"
        },
        "67966": {
            "email": "touponticelli@pausd.org",
            "name": "Tiffany Ou-Ponticelli",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S102",
            "ext": "6827"
        },
        "69363": {
            "email": "tkitada@pausd.org",
            "name": "Terence Kitada",
            "dept": "English",
            "phone": "354-8238",
            "room": "N108",
            "ext": "6798"
        },
        "69506": {
            "email": "sraptis@pausd.org",
            "name": "Sofia Raptis",
            "dept": "Science Dept",
            "phone": "354-8246",
            "room": "J Science Prep"
        },
        "70583": {
            "email": "mmcginn@pausd.org",
            "name": "Matthew McGinn",
            "dept": "PE/Dept. Head",
            "phone": "354-8266",
            "room": "Gym",
            "ext": "5778"
        },
        "70862": {
            "email": "eherrera@pausd.org",
            "name": "Elena Herrera",
            "dept": "Cafeteria",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "71882": {
            "email": "lhernandez@pausd.org",
            "name": "Luciano Hernandez",
            "dept": "Custodial Supervisor",
            "phone": "354-8204",
            "room": "Custodian",
            "ext": "5527"
        },
        "72064": {
            "email": "eyun@pausd.org",
            "name": "Emily Yun",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N115, 211, 213",
            "ext": "6810"
        },
        "72249": {
            "email": "gtantod@pausd.org",
            "name": "Gopi Tantod",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N206"
        },
        "72608": {
            "name": "Kitchen",
            "dept": "Cafeteria",
            "phone": "354-8233",
            "room": "V18, P116",
            "ext": "5830"
        },
        "72969": {
            "email": "tfirenzi@pausd.org",
            "name": "Tara Firenzi",
            "dept": "Social Studies/TOSA",
            "phone": "354-8237",
            "room": "C8",
            "ext": "6002"
        },
        "73326": {
            "email": "ewatanabe@pausd.org",
            "name": "Evan Watanabe",
            "dept": "Psychologist",
            "phone": "354-8213",
            "room": "K13A",
            "ext": "1419"
        },
        "73888": {
            "email": "kjohnson@pausd.org",
            "name": "Kevin Johnson",
            "dept": "Assistant Athletic Director",
            "phone": "354-8257",
            "room": "Gym",
            "ext": "5923"
        },
        "76235": {
            "email": "ceggert@pausd.org",
            "name": "Chris Eggert",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "C8, C3"
        },
        "76815": {
            "email": "sgriswold@pausd.org",
            "name": "Silvia Griswold",
            "dept": "Budget Secretary",
            "phone": "354-8274",
            "room": "E building",
            "ext": "5102"
        },
        "77108": {
            "email": "nbarana@pausd.org",
            "name": "Neil Barana",
            "dept": "Custodial",
            "phone": "354-8205",
            "room": "Custodial"
        },
        "77446": {
            "email": "mcasey@pausd.org",
            "name": "Monica Casey",
            "dept": "Library Assistant",
            "phone": "354-8252",
            "room": "Library"
        },
        "77467": {
            "email": "mdickson@pausd.org",
            "name": "Myesha Dickson",
            "dept": "Guidance",
            "phone": "354-8207",
            "room": "P233",
            "ext": "5718"
        },
        "77530": {
            "email": "akinyanjui@pausd.org",
            "name": "Arthur Kinyanjui",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "V6",
            "ext": "5937"
        },
        "78098": {
            "email": "cnorberg@pausd.org",
            "name": "Christina Norberg",
            "dept": "Science/SELF TOSA",
            "phone": "354-8246",
            "room": "J10, J9"
        },
        "78270": {
            "email": "tyoung@pausd.org",
            "name": "Timothy Young",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K10"
        },
        "78625": {
            "email": "mclark@pausd.org",
            "name": "Melissa Clark",
            "dept": "Psychologist",
            "phone": "354-8216",
            "room": "K13B",
            "ext": "5109"
        },
        "79115": {
            "email": "slewis@pausd.org",
            "name": "Sandra Lewis",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S102",
            "ext": "1444"
        },
        "79192": {
            "email": "tsummers@pausd.org",
            "name": "Todd Summers",
            "dept": "VAPA/Dept. Head",
            "phone": "354-8264",
            "room": "S102",
            "ext": "1441"
        },
        "79252": {
            "email": "ksaxena@pausd.org",
            "name": "Karen Saxena",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N213"
        },
        "79485": {
            "email": "rlopez@pausd.org",
            "name": "Rocio Lopez",
            "dept": "Foor Services",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "79781": {
            "email": "dhahn@pausd.org",
            "name": "Danny Hahn",
            "dept": "Math/Dept. Head",
            "phone": "354-8247",
            "room": "N214"
        },
        "79799": {
            "email": "bboyd@pausd.org",
            "name": "Brandon Boyd",
            "dept": "Campus Supervisor",
            "phone": "354-8200",
            "room": "E building"
        },
        "79923": {
            "email": "jsilverbush@pausd.org",
            "name": "Jacquelyn Silverbush",
            "dept": "Math",
            "phone": "354-8247",
            "room": "N210"
        },
        "80933": {
            "email": "sukim@pausd.org",
            "name": "Susy Kim",
            "dept": "Attendance",
            "phone": "354-8210",
            "room": "E building",
            "ext": "6015"
        },
        "80959": {
            "email": "plyons@pausd.org",
            "name": "Phil Lyons",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "F1",
            "ext": "5576"
        },
        "81236": {
            "email": "pholmes@pausd.org",
            "name": "Patricia Holmes",
            "dept": "Social Studies/CTE",
            "phone": "849-7951",
            "room": "F6",
            "ext": "5479"
        },
        "81317": {
            "email": "ggarger@pausd.org",
            "name": "Gabriela Garger",
            "dept": "World Language",
            "phone": "354-8241",
            "room": "G4",
            "ext": "5960"
        },
        "82979": {
            "email": "scofman@pausd.org",
            "name": "Stacey Kofman",
            "dept": "CTE",
            "phone": "354-8245"
        },
        "83070": {
            "email": "lmartinez@pausd.org",
            "name": "Leticia Martinez",
            "dept": "Transitionist",
            "room": "V7",
            "ext": "6874",
            "phone": ""
        },
        "84639": {
            "email": "mzipperstein@pausd.org",
            "name": "Max Zipperstein",
            "dept": "Social Studies/Living Skills",
            "phone": "354-8237",
            "room": "C7"
        },
        "84678": {
            "email": "dslocum@pausd.org",
            "name": "Dethrick Slocum",
            "dept": "SpEd",
            "phone": "354-8262",
            "room": "K15"
        },
        "85765": {
            "email": "osmith@pausd.org",
            "name": "Ofelia Smith",
            "dept": "Registrar",
            "phone": "354-8284",
            "room": "P233",
            "ext": "5266"
        },
        "86079": {
            "email": "hmellows@pausd.org",
            "name": "Heather Mellows",
            "dept": "Science/Dept. Head",
            "phone": "354-8246",
            "room": "J5, J8",
            "ext": "6835"
        },
        "86216": {
            "email": "dichikawa@pausd.org",
            "name": "Diane Ichikawa",
            "dept": "English",
            "phone": "354-8238",
            "room": "N112, PE classroom"
        },
        "86325": {
            "email": "mhernandez@pausd.org",
            "name": "Mark Hernandez",
            "dept": "English",
            "phone": "354-8238",
            "room": "N105",
            "ext": "5569"
        },
        "86434": {
            "email": "cmain@pausd.org",
            "name": "Carole Main",
            "dept": "Main Office Secretary",
            "phone": "354-8254",
            "room": "E building",
            "ext": "6746"
        },
        "86476": {
            "email": "mmendoza@pausd.org",
            "name": "Mayra Mendoza",
            "dept": "Cafeteria",
            "phone": "354-8233",
            "room": "V18, P116"
        },
        "86596": {
            "email": "jwellsakis@pausd.org",
            "name": "Jennifer Wells Akis",
            "dept": "ELL Aide",
            "phone": "849-7922",
            "room": "K4"
        },
        "86606": {
            "email": "mdurquet@pausd.org",
            "name": "Marie Durquet",
            "dept": "VAPA",
            "phone": "849-7903",
            "room": "M1",
            "ext": "1403"
        },
        "87411": {
            "email": "kowen@pausd.org",
            "name": "Kristen Owen",
            "dept": "English/Intervention TOSA",
            "phone": "354-8238",
            "room": "N102, K14"
        },
        "87712": {
            "email": "afitzhugh@pausd.org",
            "name": "Angelina Fitzhugh",
            "dept": "VAPA",
            "phone": "354-8264",
            "room": "S121",
            "ext": "5664"
        },
        "88433": {
            "email": "hselznick@pausd.org",
            "name": "Howard Selznick",
            "dept": "SpEd Aide",
            "phone": "354-8262",
            "room": "K building"
        },
        "88914": {
            "email": "ggoodspeed@pausd.org",
            "name": "Gordon Goodspeed",
            "dept": "Custodian",
            "phone": "354-8205",
            "room": "Custodial"
        },
        "90306": {
            "email": "kknaack@pausd.org",
            "name": "Kim Knaack",
            "dept": "Copy Room",
            "phone": "354-8279",
            "room": "K building",
            "ext": "5537"
        },
        "90886": {
            "email": "sfriedland@pausd.org",
            "name": "Scott Friedland",
            "dept": "Math",
            "phone": "354-8247"
        },
        "92251": {
            "email": "asu@pausd.org",
            "name": "Anita Su",
            "dept": "VAPA",
            "phone": "849-7906",
            "room": "M4"
        },
        "92464": {
            "email": "jpaley@pausd.org",
            "name": "Josh Paley",
            "dept": "CTE",
            "phone": "354-8247",
            "room": "N215",
            "ext": "5782"
        },
        "92576": {
            "email": "lgomez@pausd.org",
            "name": "Lorenzo Gomez",
            "dept": "Guidance",
            "phone": "354-8275",
            "room": "P bldg, 2nd floor",
            "ext": "6737"
        },
        "92642": {
            "email": "aarteaga@pausd.org",
            "name": "Arlena Arteaga",
            "dept": "Social Studies",
            "phone": "354-8237",
            "room": "G6",
            "ext": "5873"
        },
        "92942": {
            "email": "mbrassey@pausd.org",
            "name": "Mark Brassey",
            "dept": "Science",
            "phone": "354-8246",
            "room": "J3, J8, L1"
        },
        "93030": {
            "name": "Wellness Center",
            "dept": "Wellness",
            "phone": "354-8299",
            "room": "P231",
            "ext": "1600"
        },
        "94685": {
            "email": "jbarrera@pausd.org",
            "name": "Jorge Sanchez",
            "dept": "Campus Supervisor",
            "phone": "354-8200",
            "room": "E building"
        },
        "94848": {
            "email": "jlittle@pausd.org",
            "name": "Joshua Little",
            "dept": "Science/Living Skills",
            "phone": "354-8246",
            "room": "J3, J4",
            "ext": "6958"
        },
        "94957": {
            "email": "Amin@pausd.org",
            "name": "Arya Min",
            "dept": "English",
            "phone": ""
        },
        "95789": {
            "email": "mparonable@pausd.org",
            "name": "Marjorie Paronable",
            "dept": "English",
            "phone": "354-8238",
            "room": "N104"
        },
        "95953": {
            "email": "mhall@pausd.org",
            "name": "Matthew Hall",
            "dept": "World Language/Dept. Head",
            "phone": "354-8241",
            "room": "H3",
            "ext": "6562"
        },
        "95959": {
            "email": "ezizmor@pausd.org",
            "name": "Elana Zizmor",
            "dept": "Science",
            "phone": "354-8246",
            "room": "J7",
            "ext": "6605"
        },
        "96682": {
            "email": "awong@pausd.org",
            "name": "Alli Wong",
            "dept": "Main Office Secretary",
            "phone": "354-8280",
            "room": "E building",
            "ext": "6250"
        },
        "96728": {
            "email": "nschworetzky@pausd.org",
            "name": "Neeti Schworetzky",
            "dept": "Science",
            "phone": "354-8246",
            "room": "V2"
        },
        "97761": {
            "email": "amerchant@pausd.org",
            "name": "Angela Merchant",
            "dept": "Science/CTE",
            "phone": "354-8241",
            "room": "L2",
            "ext": "5677"
        },
        "99789": {
            "email": "mramos@pausd.org",
            "name": "Michelle Ramos",
            "dept": "Wellness Coordinator",
            "phone": "354-8243",
            "room": "P231",
            "ext": "1518"
        }
    }
}
export default data;
