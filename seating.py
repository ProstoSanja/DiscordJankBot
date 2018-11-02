import pickle # must import it
import sys
import matplotlib.pyplot as plt
task = sys.argv[1].lower().strip()
data_list = {}

f = open("seating_pickle.pkl", "rb")
data_list = pickle.load(f)
print(data_list)
f.close()

def dump_data():
    with open("seating_pickle.pkl", "wb") as out_f:
        pickle.dump(data_list,out_f)

if task == "place":
    id = sys.argv[2]
    row, seat = int(sys.argv[3]), int(sys.argv[4])
    data_list["people"][(row, seat)] = id
    dump_data()

if task == "dump":
    data_list = {"people":{}, "break":5, "rows":30, "seats":12}
    dump_data()

if task == "get":
    plt.figure()
    plt.xlabel("Lecturer")
    for row in range(data_list["rows"]):
        for seat in range(data_list["seats"]):
            seat = seat - data_list["seats"]/2
            person = data_list["people"].get((row,seat))
            if seat >= 0:
                plt.plot(seat+2, row, 'k.')
                if person:
                    plt.plot(seat+2, row, 'ro')
            else:
                plt.plot(seat, row, 'k.')
                if person:
                    plt.plot(seat, row, 'ro')

    plt.savefig('export.png')
    print("done")