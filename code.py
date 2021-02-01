import pygame
import time


class Levels:
    def __init__(self, screen):
        global LEVEL, maze1, maze2, maze3, maze4, maze5
        self.screen = screen
        self.level = LEVEL
        self.maze1 = maze1
        self.maze2 = maze2
        self.maze3 = maze3
        self.maze4 = maze4
        self.maze5 = maze5
        self.goto_level()

    def goto_level(self):
        if self.level == 1:
            self.level1()
        elif self.level == 2:
            self.level2()
        # elif self.level == 3:
        #     self.level3()
        elif self.level == 4:
            self.level4()
        elif self.level == 5:
            self.level5()
        elif self.level == 6:
            self.level6()

    def get_level_maze(self):
        if self.level == 1:
            return self.maze1
        elif self.level == 2:
            return self.maze2
        elif self.level == 4:
            return self.maze3
        elif self.level == 5:
            return self.maze4
        elif self.level == 6:
            return self.maze5

    def get_level_end(self):
        if self.level == 1:
            return 9, 11
        elif self.level == 2:
            return 11, 15
        elif self.level == 4:
            return 9, 18
        elif self.level == 5:
            return 0, 7
        elif self.level == 6:
            return 7, 8

    def level1(self):
        draw_maze1(self.screen, self.maze1)

    def level2(self):
        draw_maze2(self.screen, self.maze2)

    # def level2(self):
    #
    # def level3(self):
    #
    def level4(self):
        draw_maze2(self.screen, self.maze3)

    def level5(self):
        draw_maze3(self.screen, self.maze4)

    def level6(self):
        draw_maze3(self.screen, self.maze5)

    @staticmethod
    def level_up():
        start_coord = [[1, 0], [0, 1], [1, 0], [1, 0], [1, 0], [0, 1]]
        global LEVEL, PLAYER_COORD, MODE
        LEVEL += 1
        MODE = True
        try:
            PLAYER_COORD = start_coord[LEVEL - 1]
        except IndexError:
            pass


class Egg:
    def __init__(self, screen):
        self.screen = screen
        self.egg_word = ['Congratulations! You found an egg.',
                         'You have the opportunity for Daniel to buy you anything to eat tomorrow.']
        self.letters_egg = [[], []]
        self.sentences_egg = [[], []]
        self.egg()

    def egg(self):
        for i in range(len(self.egg_word)):
            for x in self.egg_word[i]:
                self.letters_egg[i].append(x)

        for i in range(len(self.letters_egg)):

            for n in range(len(self.letters_egg[i])):

                temp_time = pygame.time.get_ticks()

                self.sentences_egg[i] += self.letters_egg[i][n]

                while pygame.time.get_ticks() - temp_time <= 100:

                    self.screen.fill((230, 230, 230))

                    for event in pygame.event.get():
                        if event.type == pygame.QUIT:
                            exit()

                    for j in range(len(self.sentences_egg)):
                        sentence = ''
                        for s in self.sentences_egg[j]:
                            sentence += s

                        word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(sentence,
                                                                                                          True, (10, 10, 10))
                        word_rect = word_image.get_rect()
                        if j == 2:
                            word_rect.topleft = (50, 250)
                        elif j == 3:
                            word_rect.topleft = (50, 350)
                        else:
                            word_rect.topleft = (50, 100 + j * 100)
                        self.screen.blit(word_image, word_rect)

                pygame.display.update()

        temp_time = pygame.time.get_ticks()

        color = 10

        while True:
            if (pygame.time.get_ticks() - temp_time) % 5 == 0:
                color += 1
                for j in range(len(self.letters_egg)):
                    sentence = ''
                    for s in self.letters_egg[j]:
                        sentence += s

                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(sentence,
                                                                                                      True, (color, color,
                                                                                                             color))
                    word_rect = word_image.get_rect()
                    if j == 2:
                        word_rect.topleft = (50, 250)
                    elif j == 3:
                        word_rect.topleft = (50, 350)
                    else:
                        word_rect.topleft = (50, 100 + j * 100)
                    self.screen.blit(word_image, word_rect)

                pygame.display.update()

                if color == 230:
                    break


class Branch7:
    def __init__(self, screen, num):
        self.screen = screen
        self.num = num
        self.acc_next = False

        self.table_image = pygame.image.load('table.png')
        self.table_image = pygame.transform.smoothscale(self.table_image,  (800, 400))
        self.table_rect = self.table_image.get_rect()
        self.table_rect.center = (500, 700)
        self.table_rect.topleft = (50, 250)
        self.screen.blit(self.table_image, self.table_rect)

        instructions = ['Tip: Every three bases in DNA can be finally translated into one amino acid.',
                        'Use this table to help you translate.',
                        'Capital the first letter of the abbreviation of the amino acid.',
                        'Use minus sign to connect amino acids and do not leave space between them.']

        for i in range(4):
            self.word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 15).render(instructions[i],
                                                                                                   True, (10, 10, 10))
            self.word_rect = self.word_image.get_rect()
            self.word_rect.topleft = (50, 30 + i * 50)
            self.screen.blit(self.word_image, self.word_rect)

        self.m_s = ['Lys-Gly-Gly',
                    'Gly-Asp-Gly-Gly-Gly-Gly',
                    'Gly-Gly-Ser-Gly-Ser']

        self.check()

    def check(self):
        global CORRECT, FILLS
        s = ''
        for i in FILLS:
            s += i
        if s == self.m_s[self.num]:
            CORRECT = True
            FILLS = []
            Chem(self.screen).next()
        else:
            CORRECT = False


class Chem:
    def __init__(self, screen):
        global CHEM_LEV
        self.screen = screen
        self.branch_num = CHEM_LEV
        self.reactions = [['Acid, KMnO4', 'PCl5, controlled temperature', 'K2Cr2O7, dilute H2SO4, heat', 'NaOH(aq), heat in reflux', 'K2Cr2O7, dilute H2SO4, heat'],
                          ['conc. H3PO4(aq), high temperature', 'same as A to D'],
                          ['SOCl2', 'strong base'],
                          ['none'],
                          ['enzyme 1                                    enzyme 2'],
                          ['polymerisation'],
                          [],
                          ['SOCl2, warm', 'conc. NH3, high P', 'acid, K2Cr2O7', 'SOCl2']]
        self.questions = [['The C=C bond is broken and each C atom bonds to a new group (same for both C). Which is the possible group added?',
                           'Both SN1 & SN2 are possible for this reaction. Which carbon has its hydroxyl group substituted?',
                           'The reaction (oxidation) can not go any further. Which group has the hydroxyl turned to?',
                           'Before neutralisation, what will be the structure of 2 C atoms at the bottom?',
                           'By finding out which property does K2Cr2O7 have, choose the type of reaction?', ],
                          ['It is known that the same functional group has been added to both C atoms at the end, what is the group added?',
                           'You have synthesised one component of the final compound, press "1" to continue.'],
                          ['Choose the name of the product',
                           'Which C atom will be deprotonated?'],
                          ['Press 1 to continue'],
                          ['Which glycosidic bond(s) does starch branching enzyme contribute to (notice its name)?'],
                          ['Which type of polymerisation is this? What kind of linkage is formed between these monomers?'],
                          ['polypeptide A: TTT CCC CCT', 'polypeptide B: CCG CTA CCA CCT CCG CCC', 'polypeptide C: CCC CCT TCA CCG TCG'],
                          ['What mechanism can be applied in this reaction?',
                           'What is the direct by-product of this reaction?',
                           'What is the colour change of this reaction?',
                           'What type of product is formed?']]
        self.choices = [[['-H', '=O', '-OH'], ['C1', 'C2', 'C3'], ['-COH(aldehyde)', '-COOH(carboxylic acid)', '-CH(OH)2(diol)'], ['CHOHCOO-', 'CHOHCOOH', 'CHOHCH(OH)2'], ['deprotonation', 'reduction', 'oxidation']],
                        [['-PO3', '-OPO3', '-OH'], ['~', '~', '~']],
                        [['1-chloroheptan-1-oic acid', 'heptanoyl chloride', 'heptan-1-oate chloride'], ['C1', 'C2', 'C7']],
                        [['~', '~', '~']],
                        [['1-2, 2-3 & 3-4', '4-5', 'all of them']],
                        [['addition, amide', 'addition, ester', 'condensation, ester']],
                        [],
                        [['SN1', 'SN2', 'both possible'], ['HCl', 'NH4Cl', 'NCl3'], ['purple to green', 'purple to orange', 'orange to green'], ['amide', 'halogenoalkane', 'acyl chloride']]]
        self.m_s = [[2, 1, 1, 0, 2], [2, 0], [1, 1], [0], [0], [2], [], [1, 0, 2, 2]]

        if self.branch_num[0] != 6:
            self.question_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 18).render(self.questions[self.branch_num[0]][self.branch_num[1]],
                                                                                                       True, (10, 10, 10))
            self.question_rect = self.question_image.get_rect()
            self.question_rect.topleft = (30, 50)
            self.show_question()
        else:
            self.question_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render(self.questions[self.branch_num[0]][self.branch_num[1]],
                                                                                                       True, (10, 10, 10))
            self.question_rect = self.question_image.get_rect()
            self.question_rect.topleft = (680, 50)
            self.show_question()

        if CORRECT:
            self.correct_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render('CORRECT',
                                                                                                      True, (0, 220, 0))
            self.correct_rect = self.correct_image.get_rect()
            self.correct_rect.center = (500, 700)
            self.correct()
        else:
            self.wrong_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render('WRONG',
                                                                                                    True, (220, 0, 0))
            self.wrong_rect = self.wrong_image.get_rect()
            self.wrong_rect.center = (500, 700)
            self.wrong()

        self.branch()

        if self.branch_num[0] < 4 or self.branch_num[0] == 7:
            self.arrow_image = pygame.image.load('arrow.png')
            self.arrow_image = pygame.transform.smoothscale(self.arrow_image, (400, 400))
            self.arrow_rect = self.arrow_image.get_rect()
            self.arrow_rect.center = (570, 400)
            self.show_arrow()

            self.condition_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 18).render(self.reactions[self.branch_num[0]][self.branch_num[1]],
                                                                                                        True, (10, 10, 10))
            self.condition_rect = self.condition_image.get_rect()
            self.condition_rect.topleft = (400, 385)
            self.show_condition()

        elif self.branch_num[0] == 4:
            for i in range(2):
                self.arrow_image = pygame.image.load('arrow.png')
                self.arrow_image = pygame.transform.smoothscale(self.arrow_image, (100, 100))
                self.arrow_rect = self.arrow_image.get_rect()
                self.arrow_rect.center = (300 + i * 240, 380)
                self.show_arrow()

            self.condition_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 18).render(self.reactions[self.branch_num[0]][self.branch_num[1]],
                                                                                                        True, (10, 10, 10))
            self.condition_rect = self.condition_image.get_rect()
            self.condition_rect.topleft = (250, 300)
            self.show_condition()

        elif self.branch_num[0] == 5:
            self.arrow_image = pygame.image.load('arrow.png')
            self.arrow_image = pygame.transform.smoothscale(self.arrow_image, (100, 100))
            self.arrow_rect = self.arrow_image.get_rect()
            self.arrow_rect.center = (400, 350)
            self.show_arrow()

            self.word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 40).render('+',
                                                                                                   True, (10, 10, 10))
            self.word_rect = self.word_image.get_rect()
            self.word_rect.center = (200, 350)
            self.screen.blit(self.word_image, self.word_rect)

            self.condition_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 18).render(self.reactions[self.branch_num[0]][self.branch_num[1]],
                                                                                                        True, (10, 10, 10))
            self.condition_rect = self.condition_image.get_rect()
            self.condition_rect.topleft = (320, 400)
            self.show_condition()
        elif self.branch_num[0] == 6:
            pass

        if self.branch_num[0] != 6:
            for i in range(3):
                self.word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render(chr(i + 49) + '.  ' + self.choices[self.branch_num[0]][self.branch_num[1]][i],
                                                                                                       True, (10, 10, 10))
                self.word_rect = self.word_image.get_rect()
                self.word_rect.topleft = (800, 200 + i * 200)
                self.show_word()

    def show_arrow(self):
        self.screen.blit(self.arrow_image, self.arrow_rect)

    def show_condition(self):
        self.screen.blit(self.condition_image, self.condition_rect)

    def show_question(self):
        self.screen.blit(self.question_image, self.question_rect)

    def show_word(self):
        self.screen.blit(self.word_image, self.word_rect)

    def correct(self):
        self.screen.blit(self.correct_image, self.correct_rect)

    def wrong(self):
        self.screen.blit(self.wrong_image, self.wrong_rect)

    def judge_mcq(self, event):
        global CORRECT
        try:
            if event.key == pygame.K_1:
                if self.m_s[self.branch_num[0]][self.branch_num[1]] == 0:
                    self.next()
                    CORRECT = True
                else:
                    CORRECT = False
            elif event.key == pygame.K_2:
                if self.m_s[self.branch_num[0]][self.branch_num[1]] == 1:
                    self.next()
                    CORRECT = True
                else:
                    CORRECT = False
            elif event.key == pygame.K_3:
                if self.m_s[self.branch_num[0]][self.branch_num[1]] == 2:
                    self.next()
                    CORRECT = True
                else:
                    CORRECT = False
        except IndexError:
            pass

    def branch(self):
        if self.branch_num[0] == 0:
            self.Branch1(self.screen, self.branch_num)
        elif self.branch_num[0] == 1:
            self.Branch2(self.screen, self.branch_num)
        elif self.branch_num[0] == 2:
            self.Branch3(self.screen, self.branch_num)
        elif self.branch_num[0] == 3:
            self.Branch4(self.screen, self.branch_num)
        elif self.branch_num[0] == 4:
            self.Branch5(self.screen, self.branch_num)
        elif self.branch_num[0] == 5:
            self.Branch6(self.screen, self.branch_num)
        elif self.branch_num[0] == 6:
            Branch7(self.screen, self.branch_num[1])
        elif self.branch_num[0] == 7:
            self.Branch8(self.screen, self.branch_num)

    def next(self):
        global FILLS
        if self.branch_num[0] == 0:
            if self.branch_num[1] < 4:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 1:
            if self.branch_num[1] < 1:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 2:
            if self.branch_num[1] < 1:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 3:
            if self.branch_num[1] < 0:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 4:
            if self.branch_num[1] < 0:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 5:
            if self.branch_num[1] < 0:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 6:
            FILLS = []
            if self.branch_num[1] < 2:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0
        elif self.branch_num[0] == 7:
            if self.branch_num[1] < 4:
                self.branch_num[1] += 1
            else:
                self.branch_num[0] += 1
                self.branch_num[1] = 0

    @staticmethod
    def blit_image(screen, material, rect):
        screen.blit(material, rect)

    @staticmethod
    def one_two_shrink(material):
        return pygame.transform.smoothscale(material, (300, 600))

    @staticmethod
    def two_one_shrink(material):
        return pygame.transform.smoothscale(material, (300, 150))

    @staticmethod
    def one_one_shrink(material):
        return pygame.transform.smoothscale(material, (250, 250))

    class Branch1:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 1 Lipid/starting material 1.png'),
                          pygame.image.load('Branch 1 Lipid/A.png'),
                          pygame.image.load('Branch 1 Lipid/B.png'),
                          pygame.image.load('Branch 1 Lipid/C.png'),
                          pygame.image.load('Branch 1 Lipid/D.png')]
            self.result = pygame.image.load('Branch 1 Lipid/E.png')
            self.starting_material1 = Chem.one_two_shrink(self.chems[self.branch[1]])
            self.material_rect1 = self.starting_material1.get_rect()
            self.material_rect1.topleft = (50, 100)
            Chem.blit_image(self.screen, self.starting_material1, self.material_rect1)

    class Branch2:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 1 Lipid/starting material 2.png'),
                          pygame.image.load('Branch 1 Lipid/F.png')]
            self.result = pygame.image.load('Branch 1 Lipid/G.png')
            self.starting_material1 = Chem.one_two_shrink(self.chems[self.branch[1]])
            self.material_rect1 = self.starting_material1.get_rect()
            self.material_rect1.topleft = (50, 100)
            Chem.blit_image(self.screen, self.starting_material1, self.material_rect1)

    class Branch3:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 1 Lipid/starting material 3.png'),
                          pygame.image.load('Branch 1 Lipid/I.png')]
            self.result = pygame.image.load('Branch 1 Lipid/J.png')
            self.starting_material1 = Chem.one_two_shrink(self.chems[self.branch[1]])
            self.material_rect1 = self.starting_material1.get_rect()
            self.material_rect1.topleft = (50, 100)
            Chem.blit_image(self.screen, self.starting_material1, self.material_rect1)

    class Branch4:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 1 Lipid/starting material 4.png')]
            self.result = pygame.image.load('Branch 1 Lipid/K.png')
            self.starting_material1 = Chem.one_two_shrink(self.chems[self.branch[1]])
            self.material_rect1 = self.starting_material1.get_rect()
            self.material_rect1.topleft = (50, 100)
            Chem.blit_image(self.screen, self.starting_material1, self.material_rect1)

    class Branch5:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 2 Sugar/starting material 5.png'),
                          pygame.image.load('Branch 2 Sugar/L.png'),
                          pygame.image.load('Branch 2 Sugar/M.png')]
            for i in range(len(self.chems)):
                self.starting_material = Chem.one_one_shrink(self.chems[i])
                self.material_rect = self.starting_material.get_rect()
                self.material_rect.topleft = (50 + i * 250, 250)
                Chem.blit_image(self.screen, self.starting_material, self.material_rect)

    class Branch6:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 3 polymer/starting material 6.png'),
                          pygame.image.load('Branch 3 polymer/starting material 7.png'),
                          pygame.image.load('Branch 3 polymer//N.png')]

            self.starting_material = pygame.transform.smoothscale(self.chems[0], (250, 150))
            self.material_rect = self.starting_material.get_rect()
            self.material_rect.topleft = (100, 150)
            Chem.blit_image(self.screen, self.starting_material, self.material_rect)

            self.starting_material = Chem.one_one_shrink(self.chems[1])
            self.material_rect = self.starting_material.get_rect()
            self.material_rect.topleft = (100, 350)
            Chem.blit_image(self.screen, self.starting_material, self.material_rect)

            self.starting_material = Chem.one_one_shrink(self.chems[2])
            self.material_rect = self.starting_material.get_rect()
            self.material_rect.topleft = (450, 220)
            Chem.blit_image(self.screen, self.starting_material, self.material_rect)

    class Branch8:
        def __init__(self, screen, branch):
            self.screen = screen
            self.branch = branch
            self.chems = [pygame.image.load('Branch 5 Simple compounds/starting material 8.png'),
                          pygame.image.load('Branch 5 Simple compounds/R.png'),
                          pygame.image.load('Branch 5 Simple compounds/S.png'),
                          pygame.image.load('Branch 5 Simple compounds/T.png'),
                          pygame.image.load('Branch 5 Simple compounds//U.png')]
            self.starting_material1 = Chem.two_one_shrink(self.chems[self.branch[1]])
            self.material_rect1 = self.starting_material1.get_rect()
            self.material_rect1.topleft = (30, 280)
            Chem.blit_image(self.screen, self.starting_material1, self.material_rect1)


def draw_maze1(screen, maze):
    x = START[LEVEL - 1][0]
    y = START[LEVEL - 1][1]
    for i in range(len(maze)):
        for j in range(len(maze[i])):
            if maze[i][j] == 1:
                pygame.draw.rect(screen, (10, 10, 10), ((x + 40 * j, y + 40 * i),
                                                        (40, 40)))
            if maze[i][j] == 2:
                pygame.draw.rect(screen, (50, 50, 250), ((x + 40 * j, y + 40 * i),
                                                         (40, 40)))
            if maze[i][j] == 3:
                pygame.draw.rect(screen, (100, 100, 100), ((x + 40 * j, y + 40 * i),
                                                           (40, 40)))
            if maze[i][j] == 9:
                pygame.draw.rect(screen, (10, 10, 10), ((x + 40 * j, y + 40 * i),
                                                        (40, 40)))


def draw_maze2(screen, maze):
    x = START[LEVEL - 1][0]
    y = START[LEVEL - 1][1]
    for i in range(len(maze)):
        for j in range(len(maze[i])):
            if (i == PLAYER_COORD[0] or i == PLAYER_COORD[0] + 1 or i == PLAYER_COORD[0] - 1) and\
                    (j == PLAYER_COORD[1] or j == PLAYER_COORD[1] + 1 or j == PLAYER_COORD[1] - 1):
                if maze[i][j] == 1:
                    pygame.draw.rect(screen, (10, 10, 10), ((x + 40 * j, y + 40 * i),
                                                            (40, 40)))
                if maze[i][j] == 2:
                    pygame.draw.rect(screen, (50, 50, 250), ((x + 40 * j, y + 40 * i),
                                                             (40, 40)))
                if maze[i][j] == 3:
                    pygame.draw.rect(screen, (100, 100, 100), ((x + 40 * j, y + 40 * i),
                                                               (40, 40)))
                if maze[i][j] == 9:
                    pygame.draw.rect(screen, (15, 15, 15), ((x + 40 * j, y + 40 * i),
                                                            (40, 40)))


def draw_maze3(screen, maze):
    x = START[LEVEL - 1][0]
    y = START[LEVEL - 1][1]
    for i in range(len(maze)):
        for j in range(len(maze[i])):
            if maze[i][j] == 1:
                pygame.draw.rect(screen, (10, 10, 10), ((x + 40 * j, y + 40 * i),
                                                        (40, 40)))
            if maze[i][j] == 2:
                pygame.draw.rect(screen, (50, 50, 250), ((x + 40 * j, y + 40 * i),
                                                         (40, 40)))
            if maze[i][j] == 3:
                pygame.draw.rect(screen, (100, 100, 100), ((x + 40 * j, y + 40 * i),
                                                           (40, 40)))
            if maze[i][j] == 8:
                pygame.draw.rect(screen, (50, 250, 50), ((x + 40 * j, y + 40 * i),
                                                         (40, 40)))
            if maze[i][j] == 9:
                pygame.draw.rect(screen, (10, 10, 10), ((x + 40 * j, y + 40 * i),
                                                        (40, 40)))


class PlayerMovements:
    def __init__(self):
        global PLAYER_COORD
        self.PLAYER_COORD = PLAYER_COORD

    def up(self):
        self.PLAYER_COORD[0] -= 1

    def down(self):
        self.PLAYER_COORD[0] += 1

    def left(self):
        self.PLAYER_COORD[1] -= 1

    def right(self):
        self.PLAYER_COORD[1] += 1

    def back_to_start(self, coord):
        self.PLAYER_COORD = coord


def move(screen, event, move_count):
    global maze1, maze2, maze3, maze4, MODE
    keys = [pygame.K_w, pygame.K_s, pygame.K_d, pygame.K_a]

    maze = Levels(screen).get_level_maze()
    finish = Levels(screen).get_level_end()

    if MODE:
        if event.key == pygame.K_w:
            move_count += 1
            if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 3:
                    pass
                if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 9:
                    if LEVEL == 2:
                        maze2[0][11] = 6
                elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 0 and maze[PLAYER_COORD[0] - 2][PLAYER_COORD[1]] == 0:
                    PlayerMovements().up()
                    PlayerMovements().up()
            else:
                if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 0:
                    PlayerMovements().up()
                elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 2:
                    PlayerMovements().up()
                elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 4:
                    PlayerMovements().up()
                elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 6:
                    PlayerMovements().up()
                elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 8:
                    PlayerMovements().up()

        if event.key == pygame.K_s:
            move_count += 1
            if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                if maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 3:
                    if LEVEL == 1:
                        maze1[10][1] = 4
                elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 0 and maze[PLAYER_COORD[0] + 2][PLAYER_COORD[1]] == 0:
                    PlayerMovements().down()
                    PlayerMovements().down()
            else:
                if maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 0:
                    PlayerMovements().down()
                elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 2:
                    PlayerMovements().down()
                elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 4:
                    PlayerMovements().down()
                elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 8:
                    PlayerMovements().down()

        if event.key == pygame.K_d:
            move_count += 1
            if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                if maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 3:
                    pass
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 0 and maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 2] == 0:
                    PlayerMovements().right()
                    PlayerMovements().right()
            else:
                if maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 0:
                    PlayerMovements().right()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 2:
                    PlayerMovements().right()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 4:
                    PlayerMovements().right()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 8:
                    PlayerMovements().right()

        if event.key == pygame.K_a:
            move_count += 1
            if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                if maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 3:
                    pass
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 0 and maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 2] == 0:
                    PlayerMovements().left()
                    PlayerMovements().left()
            else:
                if maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 0:
                    PlayerMovements().left()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 2:
                    PlayerMovements().left()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 4:
                    PlayerMovements().left()
                elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 8:
                    PlayerMovements().left()
    else:
        try:
            if event.key == pygame.K_w:
                if PLAYER_COORD[0] >= 1:
                    if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 3:
                            pass
                        if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 9:
                            if LEVEL == 2:
                                maze2[0][11] = 6
                        elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 1 and maze[PLAYER_COORD[0] - 2][PLAYER_COORD[1]] == 1:
                            PlayerMovements().up()
                            PlayerMovements().up()
                    else:
                        if maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 1:
                            PlayerMovements().up()
                        elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 2:
                            PlayerMovements().up()
                        elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 4:
                            PlayerMovements().up()
                        elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 6:
                            PlayerMovements().up()
                        elif maze[PLAYER_COORD[0] - 1][PLAYER_COORD[1]] == 8:
                            PlayerMovements().up()

            if event.key == pygame.K_s:
                if PLAYER_COORD[0] >= 0:
                    if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        if maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 3:
                            if LEVEL == 1:
                                maze1[10][1] = 4
                        elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 1 and maze[PLAYER_COORD[0] + 2][PLAYER_COORD[1]] == 1:
                            PlayerMovements().down()
                            PlayerMovements().down()
                    else:
                        if maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 1:
                            PlayerMovements().down()
                        elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 2:
                            PlayerMovements().down()
                        elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 4:
                            PlayerMovements().down()
                        elif maze[PLAYER_COORD[0] + 1][PLAYER_COORD[1]] == 8:
                            PlayerMovements().down()

            if event.key == pygame.K_d:
                if PLAYER_COORD[1] >= 0:
                    if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        if maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 3:
                            pass
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 1 and maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 2] == 1:
                            PlayerMovements().right()
                            PlayerMovements().right()
                    else:
                        if maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 1:
                            PlayerMovements().right()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 2:
                            PlayerMovements().right()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 4:
                            PlayerMovements().right()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] + 1] == 8:
                            PlayerMovements().right()

            if event.key == pygame.K_a:
                if PLAYER_COORD[1] >= 1:
                    if pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        if maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 3:
                            pass
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 1 and maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 2] == 1:
                            PlayerMovements().left()
                            PlayerMovements().left()
                    else:
                        if maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 1:
                            PlayerMovements().left()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 2:
                            PlayerMovements().left()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 4:
                            PlayerMovements().left()
                        elif maze[PLAYER_COORD[0]][PLAYER_COORD[1] - 1] == 8:
                            PlayerMovements().left()
        except IndexError:
            pass

    if PLAYER_COORD[0] == finish[0] and PLAYER_COORD[1] == finish[1]:
        Levels.level_up()
    if maze[PLAYER_COORD[0]][PLAYER_COORD[1]] == 4:
        Levels.level_up()
    elif maze[PLAYER_COORD[0]][PLAYER_COORD[1]] == 5:
        Levels.level_up()
    elif maze[PLAYER_COORD[0]][PLAYER_COORD[1]] == 6:
        Egg(screen)
        maze[PLAYER_COORD[0]][PLAYER_COORD[1]] = 1
        PlayerMovements().down()
    elif maze[PLAYER_COORD[0]][PLAYER_COORD[1]] == 8:
        MODE = not MODE

    if event.key in keys:
        return False, move_count
    else:
        return True, move_count


def block(screen):
    speed = SPEED

    while speed > 50:

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()

        time_ = speed / AC * 0.01

        screen.fill((230, 230, 230))

        pygame.draw.rect(screen, (220, 0, 0), ((475, 250), (250, 250)))
        pygame.display.update()

        for i in range(100):
            screen.fill((230, 230, 230))
            movement = speed * (i + 1) * time_ - 0.5 * AC * (((i + 1) * time_) ** 2)
            pygame.draw.rect(screen, (220, 0, 0), ((475, 250 - movement),
                                                   (250, 250)))
            pygame.display.update()
            time.sleep(time_)

        for i in range(100):
            screen.fill((230, 230, 230))
            movement = 0.5 * AC * (((i + 1) * time_) ** 2)
            pygame.draw.rect(screen, (220, 0, 0), ((475, 250 - (0.5 * AC * ((100 * time_) ** 2)) + movement),
                                                   (250, 250)))
            pygame.display.update()
            time.sleep(time_)

        speed /= 1.8

    time.sleep(0.5)


def add_to_fill(event):
    global FILLS
    for i in range(97, 123):
        if event.key == i:
            if pygame.key.get_mods() & pygame.KMOD_SHIFT or pygame.key.get_mods() & pygame.KMOD_CAPS:
                FILLS.append(chr(i - 32))
            else:
                FILLS.append(chr(i))
    if event.key == pygame.K_MINUS:
        FILLS.append('-')
    if event.key == pygame.K_DELETE:
        try:
            del FILLS[-1]
        except IndexError:
            pass


def run_game():
    pygame.init()
    pygame.key.set_repeat(300, 350)
    screen = pygame.display.set_mode((1200, 800))
    pygame.display.set_caption('MAZE')

    screen.fill((230, 230, 230))

    start = False

    while True:
        screen.fill((255, 255, 255))

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_c:
                    start = True

        if start:
            break
        else:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 50).render('SIENNA THE BLOCK',
                                                                                              True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.center = (580, 350)
            screen.blit(word_image, word_rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render('Press c to start the game',
                                                                                              True, (220, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 600)
            screen.blit(word_image, word_rect)

        pygame.display.update()

    word_1 = ['Once upon a time', 'There was a little red block']

    for words in word_1:

        temp_time = pygame.time.get_ticks()
        color = 10

        while pygame.time.get_ticks() - temp_time <= 2100:

            screen.fill((230, 230, 230))

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    exit()

            if pygame.time.get_ticks() - temp_time <= 1000:
                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 80).render(words,
                                                                                                  True, (10, 10, 10))
                word_rect = word_image.get_rect()
                word_rect.center = (600, 350)
                screen.blit(word_image, word_rect)
                pygame.display.update()

            else:
                if (pygame.time.get_ticks() - temp_time) % 5 == 0:
                    color += 1
                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 80).render(words, True,
                                                                                                      (color, color,
                                                                                                       color))
                    word_rect = word_image.get_rect()
                    word_rect.center = (600, 350)
                    screen.blit(word_image, word_rect)
                    pygame.display.update()

    screen.fill((230, 230, 230))
    pygame.display.update()
    time.sleep(0.5)
    block(screen)

    word_2 = ['You can call her Sienna', 'SHE LOST HERSELF...', 'IN THE DARK WOODS']

    for words in word_2:

        temp_time = pygame.time.get_ticks()
        color = 10

        while pygame.time.get_ticks() - temp_time <= 2100:

            screen.fill((230, 230, 230))

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    exit()

            if pygame.time.get_ticks() - temp_time <= 1000:
                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 80).render(words,
                                                                                                  True, (10, 10, 10))
                word_rect = word_image.get_rect()
                word_rect.center = (600, 350)
                screen.blit(word_image, word_rect)
                pygame.display.update()

            else:
                if (pygame.time.get_ticks() - temp_time) % 5 == 0:
                    color += 1
                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 80).render(words, True,
                                                                                                      (color, color,
                                                                                                       color))
                    word_rect = word_image.get_rect()
                    word_rect.center = (600, 350)
                    screen.blit(word_image, word_rect)
                    pygame.display.update()

    word_3 = ['In this game there are 4 levels.',
              'After finishing all levels you can help Sienna the block find the way',
              'out of the woods.',
              'There is one easter egg, hope you can find it.']

    letters_3 = [[], [], [], []]
    for i in range(len(word_3)):
        for x in word_3[i]:
            letters_3[i].append(x)

    sentences = [[], [], [], []]

    for i in range(len(letters_3)):

        for n in range(len(letters_3[i])):

            temp_time = pygame.time.get_ticks()

            sentences[i] += letters_3[i][n]

            while pygame.time.get_ticks() - temp_time <= 100:

                screen.fill((230, 230, 230))

                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        exit()

                for j in range(len(sentences)):
                    sentence = ''
                    for s in sentences[j]:
                        sentence += s

                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(sentence,
                                                                                                      True, (10, 10, 10))
                    word_rect = word_image.get_rect()
                    if j == 2:
                        word_rect.topleft = (50, 250)
                    elif j == 3:
                        word_rect.topleft = (50, 350)
                    else:
                        word_rect.topleft = (50, 100 + j * 100)
                    screen.blit(word_image, word_rect)

            pygame.display.update()

    temp_time = pygame.time.get_ticks()

    color = 10

    while True:
        if (pygame.time.get_ticks() - temp_time) % 5 == 0:
            color += 1
            for j in range(len(letters_3)):
                sentence = ''
                for s in letters_3[j]:
                    sentence += s

                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(sentence,
                                                                                                  True, (color, color,
                                                                                                         color))
                word_rect = word_image.get_rect()
                if j == 2:
                    word_rect.topleft = (50, 250)
                elif j == 3:
                    word_rect.topleft = (50, 350)
                else:
                    word_rect.topleft = (50, 100 + j * 100)
                screen.blit(word_image, word_rect)

            pygame.display.update()

            if color == 230:
                break

    instructions1 = ['Use the keys WASD to control the movement of Sienna.',
                     'Pressing down the key SHIFT can make Sienna dash. She can move 2 units with a dash',
                     "The blue block is Sienna's destination.",
                     'After Sienna reaches, she can pass to the next level.',
                     'But now the way to the destination is blocked.',
                     'Find the different block and dash towards it.']
    #
    move_count = 0
    not_press = True

    while LEVEL == 1:

        screen.fill((230, 230, 230))

        Levels(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                not_press, move_count = move(screen, event, move_count)

        try:
            pygame.draw.rect(screen, (220, 0, 0), ((START[LEVEL - 1][0] + 10 + 40 * PLAYER_COORD[1],
                                                    START[LEVEL - 1][1] + 10 + 40 * PLAYER_COORD[0]),
                                                   (20, 20)))
        except IndexError:
            pass

        if not_press and move_count == 0:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(instructions1[0],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 50)
            screen.blit(word_image, word_rect)
            temp_time = pygame.time.get_ticks()
        elif pygame.time.get_ticks() - temp_time <= 5000:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render(instructions1[1],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (50, 50)
            screen.blit(word_image, word_rect)
        elif pygame.time.get_ticks() - temp_time <= 10000:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(instructions1[2],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 50)
            screen.blit(word_image, word_rect)
        elif pygame.time.get_ticks() - temp_time <= 15000:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(instructions1[3],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 50)
            screen.blit(word_image, word_rect)
        elif pygame.time.get_ticks() - temp_time <= 20000:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(instructions1[4],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 50)
            screen.blit(word_image, word_rect)
        elif pygame.time.get_ticks() - temp_time <= 25000:
            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 30).render(instructions1[5],
                                                                                              True, (10, 10, 10))
            word_rect = word_image.get_rect()
            word_rect.topleft = (100, 50)
            screen.blit(word_image, word_rect)

        pygame.display.update()

    color = 230
    temp_time = pygame.time.get_ticks()

    while True:
        screen.fill((color, color, color))

        if color == 10:
            break
        if (pygame.time.get_ticks() - temp_time) % 5 == 0:
            color -= 1

        pygame.display.update()

    word_4 = ['Sienna fell into a DEEP CAVE', 'She cannot see clearly in the cave', 'FIND THE WAY OUT!']

    for words in word_4:

        temp_time = pygame.time.get_ticks()
        color = 200

        while pygame.time.get_ticks() - temp_time <= 1900:

            screen.fill((10, 10, 10))

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    exit()

            if pygame.time.get_ticks() - temp_time <= 1000:
                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 60).render(words,
                                                                                                  True, (200, 200, 200))
                word_rect = word_image.get_rect()
                word_rect.center = (600, 350)
                screen.blit(word_image, word_rect)
                pygame.display.update()

            else:
                if (pygame.time.get_ticks() - temp_time) % 5 == 0:
                    color -= 1
                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 60).render(words, True,
                                                                                                      (color, color,
                                                                                                       color))
                    word_rect = word_image.get_rect()
                    word_rect.center = (600, 350)
                    screen.blit(word_image, word_rect)
                    pygame.display.update()

    while LEVEL == 2:

        screen.fill((40, 40, 40))

        Levels(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                not_press, move_count = move(screen, event, move_count)

        try:
            pygame.draw.rect(screen, (220, 0, 0), ((START[LEVEL - 1][0] + 10 + 40 * PLAYER_COORD[1],
                                                   START[LEVEL - 1][1] + 10 + 40 * PLAYER_COORD[0]),
                                                   (20, 20)))
        except IndexError:
            pass

        pygame.display.update()

    instructions2 = ['Sienna sees a stone tablet in the dark. On the tablet there is a question.',
                     'This question is about synthesising an organic compound.',
                     'Which can help Sienna the block to get out of the cave.',
                     'Complete the synthetic route to find out the structure of this compound.',
                     'Good luck!',
                     '(Note: You can only try again after 3 seconds if you choose the wrong answer.)']

    letters_3 = [[], [], [], [], [], []]
    for i in range(len(instructions2)):
        for x in instructions2[i]:
            letters_3[i].append(x)

    sentences = [[], [], [], [], [], []]

    for i in range(len(instructions2)):

        for n in range(len(instructions2[i])):

            temp_time = pygame.time.get_ticks()

            sentences[i] += instructions2[i][n]

            while pygame.time.get_ticks() - temp_time <= 100:

                screen.fill((230, 230, 230))

                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        exit()

                for j in range(len(sentences)):
                    sentence = ''
                    for s in sentences[j]:
                        sentence += s

                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render(sentence,
                                                                                                      True,
                                                                                                      (10, 10, 10))
                    word_rect = word_image.get_rect()

                    word_rect.topleft = (50, 100 + j * 100)

                    screen.blit(word_image, word_rect)

            pygame.display.update()

    temp_time = pygame.time.get_ticks()

    color = 10

    while True:
        if (pygame.time.get_ticks() - temp_time) % 5 == 0:
            color += 1
            for j in range(len(letters_3)):
                sentence = ''
                for s in letters_3[j]:
                    sentence += s

                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render(sentence,
                                                                                                  True, (color, color,
                                                                                                         color))
                word_rect = word_image.get_rect()

                word_rect.topleft = (50, 100 + j * 100)

                screen.blit(word_image, word_rect)

            pygame.display.update()

            if color == 230:
                break

    temp_time = pygame.time.get_ticks() - 3000
    print(LEVEL)

    while CHEM_LEV[0] < 6:
        screen.fill((255, 255, 255))

        Chem(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                if pygame.time.get_ticks() - temp_time > 3000:
                    Chem(screen).judge_mcq(event)
                    temp_time = pygame.time.get_ticks()

        pygame.display.update()

    while CHEM_LEV[0] == 6:
        screen.fill((255, 255, 255))

        Chem(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                add_to_fill(event)

        string = ''
        for x in FILLS:
            string += x
        key_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render(string, True, (0, 0, 0))
        key = key_image.get_rect()
        key.topleft = (700, 100)
        screen.blit(key_image, key)

        pygame.display.update()

    while CHEM_LEV[0] == 7:
        screen.fill((255, 255, 255))

        try:
            Chem(screen)
        except IndexError:
            break

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                if pygame.time.get_ticks() - temp_time > 3000:
                    Chem(screen).judge_mcq(event)
                    temp_time = pygame.time.get_ticks()

        pygame.display.update()

    temp_time = pygame.time.get_ticks()

    while True:
        screen.fill((255, 255, 255))

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()

        if pygame.time.get_ticks() - temp_time < 6000:
            image = pygame.image.load('one.png')
            image = pygame.transform.smoothscale(image, (1200, 800))
            rect = image.get_rect()
            rect.topleft = (0, 0)
            screen.blit(image, rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render('Congrats! You have synthesised and collected many intermediate products: (it will skip after 6 seconds)', True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (0, 0)
            screen.blit(word_image, word_rect)

        elif pygame.time.get_ticks() - temp_time < 16000:
            image = pygame.image.load('two.png')
            image = pygame.transform.smoothscale(image, (1200, 800))
            rect = image.get_rect()
            rect.topleft = (0, 0)
            screen.blit(image, rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render('Some of them can further react, can you guess what is this now? (it will skip after 10 seconds)', True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (0, 0)
            screen.blit(word_image, word_rect)

        elif pygame.time.get_ticks() - temp_time < 26000:
            image = pygame.image.load('final assemble/Z.png')
            image = pygame.transform.smoothscale(image, (1200, 800))
            rect = image.get_rect()
            rect.topleft = (0, 0)
            screen.blit(image, rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render('I think you can figure it out now. But if not (in the case which you are an idiot), please wait for a further 10 seconds.', True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (0, 0)
            screen.blit(word_image, word_rect)

        elif pygame.time.get_ticks() - temp_time < 36000:
            image = pygame.image.load('labels.jpg')
            image = pygame.transform.smoothscale(image, (1200, 800))
            rect = image.get_rect()
            rect.topleft = (0, 0)
            screen.blit(image, rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render('With this heart which Denial gave Sienna the block. She can faster the blood circulation and increase rate of aerobic respiration.', True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (0, 0)
            screen.blit(word_image, word_rect)

        elif pygame.time.get_ticks() - temp_time < 43000:
            image = pygame.image.load('labels.jpg')
            image = pygame.transform.smoothscale(image, (1200, 800))
            rect = image.get_rect()
            rect.topleft = (0, 0)
            screen.blit(image, rect)

            word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 20).render('Then run faster and get out of the cave.', True, (0, 0, 0))
            word_rect = word_image.get_rect()
            word_rect.topleft = (0, 0)
            screen.blit(word_image, word_rect)

        else:
            Levels.level_up()
            break

        pygame.display.update()

    while LEVEL == 4:
        screen.fill((40, 40, 40))

        Levels(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                not_press, move_count = move(screen, event, move_count)

        try:
            pygame.draw.rect(screen, (220, 0, 0), ((START[LEVEL - 1][0] + 10 + 40 * PLAYER_COORD[1],
                                                    START[LEVEL - 1][1] + 10 + 40 * PLAYER_COORD[0]),
                                                   (20, 20)))
        except IndexError:
            pass

        pygame.display.update()

    while LEVEL == 5:
        screen.fill((230, 230, 230))

        Levels(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                not_press, move_count = move(screen, event, move_count)

        try:
            pygame.draw.rect(screen, (220, 0, 0), ((START[LEVEL - 1][0] + 10 + 40 * PLAYER_COORD[1],
                                                    START[LEVEL - 1][1] + 10 + 40 * PLAYER_COORD[0]),
                                                   (20, 20)))
        except IndexError:
            pass

        pygame.display.update()

    while LEVEL == 6:
        screen.fill((230, 230, 230))

        Levels(screen)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()
            if event.type == pygame.KEYDOWN:
                not_press, move_count = move(screen, event, move_count)

        try:
            pygame.draw.rect(screen, (220, 0, 0), ((START[LEVEL - 1][0] + 10 + 40 * PLAYER_COORD[1],
                                                    START[LEVEL - 1][1] + 10 + 40 * PLAYER_COORD[0]),
                                                   (20, 20)))
        except IndexError:
            pass

        pygame.display.update()

    thanks = ['Sienna has finally escaped the woods under your help.',
              'Anyway, Happy Birthday',
              'Sorry that it is late for one day.']

    letters_3 = [[], [], []]
    for i in range(len(thanks)):
        for x in thanks[i]:
            letters_3[i].append(x)

    sentences = [[], [], []]

    for i in range(len(thanks)):

        for n in range(len(thanks[i])):

            temp_time = pygame.time.get_ticks()

            sentences[i] += thanks[i][n]

            while pygame.time.get_ticks() - temp_time <= 100:

                screen.fill((230, 230, 230))

                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        exit()

                for j in range(len(sentences)):
                    sentence = ''
                    for s in sentences[j]:
                        sentence += s

                    word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render(sentence,
                                                                                                      True,
                                                                                                      (10, 10, 10))
                    word_rect = word_image.get_rect()

                    word_rect.topleft = (50, 100 + j * 100)

                    screen.blit(word_image, word_rect)

            pygame.display.update()

    temp_time = pygame.time.get_ticks()

    color = 10

    while True:
        if (pygame.time.get_ticks() - temp_time) % 5 == 0:
            color += 1
            for j in range(len(letters_3)):
                sentence = ''
                for s in letters_3[j]:
                    sentence += s

                word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 25).render(sentence,
                                                                                                  True, (color, color,
                                                                                                         color))
                word_rect = word_image.get_rect()

                word_rect.topleft = (50, 100 + j * 100)

                screen.blit(word_image, word_rect)

            pygame.display.update()

            if color == 230:
                break

    pygame.mixer.init()
    pygame.mixer.music.load('music.mp3')
    pygame.mixer.music.play()
    while True:

        screen.fill((230, 230, 230))

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                exit()

        word_image = pygame.font.SysFont('microsoftyaheimicrosoftyaheiuibold', 60).render('HAPPY 16th BIRTHDAY, SIENNA',
                                                                                          True, (0, 0, 0))
        word_rect = word_image.get_rect()
        word_rect.center = (600, 350)
        screen.blit(word_image, word_rect)

        pygame.display.update()


SPEED = 500
AC = 980
LEVEL = 1
PLAYER_COORD = [1, 0]
START = [(350, 130), (200, 100), (200, 100), (200, 100), (400, 250), (200, 100)]
CHEM_LEV = [0, 0]
CORRECT = False
MODE = True
FILLS = []

# =======================================================================================================
maze1 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
         [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 2],
         [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

maze2 = [[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1],
         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
         [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

maze3 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
         [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
         [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
         [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
         [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
         [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
         [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
         [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

maze4 = [[1, 1, 1, 1, 1, 1, 1, 2],
         [0, 0, 0, 0, 0, 0, 1],
         [1, 0, 1, 1, 1, 0, 1],
         [1, 0, 1, 0, 1, 8, 1],
         [1, 1, 1, 1, 1, 1, 1]]

maze5 = [[1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 0, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
         [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 8, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 8, 1, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]


# =======================================================================================================

if __name__ == '__main__':
    run_game()
