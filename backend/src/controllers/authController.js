const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; 

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = { name, email, password: hashedPassword, role };
        users.push(newUser);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { email: user.email, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.json({ token });
};