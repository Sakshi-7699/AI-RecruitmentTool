# AI-RecruitmentTool



This projects aims to create an end-to-end conceptual solution that delivers a comprehensive profile of suitable candidates,
integrating both technical qualifications and behavioural attributes to optimise the recruitment process.



```
Techstack:
Angular: Front End
Python: Back End
MongoDB: Database
```

```
Folder Structure 
back-end: algorithm implementation and API's
front-end: angular code 
```

## Project Setup

```
# setup the conda environment
conda create -n ai_recruitment python=3.11.4
conda activate ai_recruitment
pip install -r requirements.txt

# start the backend
cd back-end
python main.py

# start the front end
sudo apt update
sudo apt install nodejs npm
cd front-end
npm install -g @angular/cli


# verify installtion
node -v
npm -v
ng version

# start the application
ng serve
```


## Test Report

Back End Coverage Test Report - Unit Testing

```
coverage run -m unittest discover
coverage html
```



Front End Jasmine Test Report - Unit Testing
```
ng test
```

## System Snapshots

Home Page
![image](https://github.com/user-attachments/assets/b394a51f-bb97-4108-a9db-4aefce089dcd)


Candidate Compatibility Cheker
![image](https://github.com/user-attachments/assets/7eb69d22-db8f-4a7c-a4e3-e4a60460ffc4)


Analysis Page
![image](https://github.com/user-attachments/assets/6bda1548-c672-4512-b9b4-6a80fd6ff3e6)





