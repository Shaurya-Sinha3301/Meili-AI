import streamlit as st
import json
import sys
from pathlib import Path
import time
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from agents.agent_controller import AgentController

st.set_page_config(page_title="Merydian Engine Demo", page_icon="🤖", layout="wide")

st.title("Merydian Engine Demo - Live Feedback Agent")
st.markdown("This demo interacts directly with the backend engine (`agents` and `ml_or`). You can provide custom customer feedback and see how the engine processes it, triggers the optimizer, and generates explanations.")

@st.cache_resource
def get_controller():
    return AgentController()

controller = get_controller()

# Define Paths
data_dir = project_root / "ml_or" / "data"
initial_solution_path = data_dir / "initial_optimized_solution.json"
base_prefs_path = data_dir / "family_preferences_3fam_strict.json"

if not initial_solution_path.exists():
    st.error(f"Initial baseline solution not found at {initial_solution_path}!")
    st.info("Run `python -m agents.optimizer_agent` first to generate it.")
    st.stop()

# Session State Initialization
if "scenarios_run" not in st.session_state:
    st.session_state.scenarios_run = []
if "current_solution" not in st.session_state:
    st.session_state.current_solution = initial_solution_path
if "current_prefs" not in st.session_state:
    st.session_state.current_prefs = base_prefs_path

# Sidebar for baseline info
with st.sidebar:
    st.header("Current Baseline Info")
    
    with open(st.session_state.current_solution, 'r') as f:
        baseline = json.load(f)
    
    num_days = len(baseline.get('days', []))
    families = baseline.get('families', [])
    st.write(f"**Trip ID:** {baseline.get('trip_id', 'N/A')}")
    st.write(f"**Days:** {num_days}")
    st.write(f"**Families:** {', '.join(families)}")
    
    for day_data in baseline.get('days', []):
        day_num = day_data.get('day', '?')
        shared_pois = day_data.get('shared_poi_order', [])
        st.write(f"**Day {day_num}:** {len(shared_pois)} shared POIs")

# Main Interface: Dynamic Scenario Builder
st.subheader("Add Custom Customer Feedback")

with st.form("feedback_form"):
    col1, col2 = st.columns([1, 1])
    with col1:
        family_id = st.selectbox("Family ID", families + ["Global/Other"])
    with col2:
        current_day = st.number_input("Current Day (0-indexed)", min_value=0, max_value=num_days-1, value=0)
    
    user_input = st.text_area("Customer Feedback Input", "E.g. We absolutely must visit Qutub Minar tomorrow on Day 2, it's a must-see for us.")
    submit_button = st.form_submit_button("Submit Feedback")

if submit_button and user_input:
    with st.spinner("Processing through the Agent Engine..."):
        # Setup context
        context = {"current_day": current_day}
        if family_id != "Global/Other":
            context["family_id"] = family_id
        
        context["previous_solution"] = str(st.session_state.current_solution)
        if st.session_state.current_prefs:
            context["current_preferences_path"] = str(st.session_state.current_prefs)
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = project_root / "agents" / "tests" / f"demo_run_streamlit_{timestamp}"
        output_dir.mkdir(parents=True, exist_ok=True)
        context["output_dir"] = str(output_dir)
        
        try:
            # Run the agent controller
            result = controller.process_user_input(user_input, context)
            
            explanations = []
            optimizer_output_dir = None
            
            if result['optimizer_output']:
                optimizer_output_dir = Path(result['optimizer_output']['llm_payloads']).parent
                payloads_file = optimizer_output_dir / "llm_payloads.json"
                
                if payloads_file.exists():
                    with open(payloads_file, 'r', encoding='utf-8') as f:
                        payload_data = json.load(f)
                    
                    payloads_to_process = []
                    if isinstance(payload_data, dict):
                        if "families" in payload_data:
                            payloads_to_process.extend(payload_data["families"])
                        if "travel_agent" in payload_data:
                            payloads_to_process.append(payload_data["travel_agent"])
                    elif isinstance(payload_data, list):
                        payloads_to_process = payload_data
                        
                    for payload in payloads_to_process:
                        explanation = controller.explainability_agent.explain(payload)
                        explanations.append({
                            "audience": payload.get("audience", "FAMILY"),
                            "family_id": payload.get("family_id", "N/A"),
                            "explanation": explanation.summary
                        })
                        time.sleep(2) # brief sleep to avoid ratelimit
                
                # Update chain state
                optimized_solution_file = optimizer_output_dir / "optimized_solution.json"
                if optimized_solution_file.exists():
                    st.session_state.current_solution = optimized_solution_file
                
                updated_prefs_file = optimizer_output_dir / "family_preferences_updated.json"
                if updated_prefs_file.exists():
                    st.session_state.current_prefs = updated_prefs_file

            # Save the result state
            scenario_output = {
                "input": user_input,
                "event": result['event'].model_dump(),
                "decision": result['decision'].model_dump(),
                "optimizer_triggered": result['decision'].action == "RUN_OPTIMIZER",
                "explanations": explanations
            }
            st.session_state.scenarios_run.append(scenario_output)
            st.success("Successfully processed feedback!")
            st.rerun() # Refresh page to show new baseline in sidebar
            
        except Exception as e:
            st.error(f"Error processing feedback: {e}")

# Display past scenarios
if st.session_state.scenarios_run:
    st.subheader("Run History")
    for i, run in enumerate(reversed(st.session_state.scenarios_run)):
        with st.expander(f"Run {len(st.session_state.scenarios_run) - i}: {run['input'][:50]}..."):
            st.write("**Input:**", run["input"])
            st.write("**Event Type:**", run["event"]["event_type"])
            st.write("**Decision Action:**", run["decision"]["action"])
            
            if run["optimizer_triggered"]:
                st.write("✅ Optimizer Triggered")
                for exp in run["explanations"]:
                    st.info(f"**Explanation for {exp['audience']} ({exp['family_id']}):** {exp['explanation']}")
            else:
                st.write("❌ Optimizer Not Triggered")
